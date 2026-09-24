"""Service de simulation partagé par le labo HTTP et le futur backend.

Réutilise les cinq fonctions de Dewi. Aucun import FastAPI, SQL ou Grafana.
Un pas physique reste égal à une seconde, même en accélération.
"""
from collections import deque
from copy import deepcopy
from datetime import datetime, timedelta, timezone
import math
import logging
import threading
import time

from app.domain.config import CONSIGNE_EC, CONSIGNE_PH, NIVEAU_RESERVE_L, TEMP_EAU_CIBLE
from app.domain.simulation import (
    tick_reserve_propre, tick_cuve_nutritive, tick_sortie_pompe,
    tick_climat, tick_retour, DEBIT_NOMINAL_L_S, PRESSION_NOMINALE_BAR,
)
from app.domain.zones import CodeQualite, EtatZone, Mesure, Sens, ZoneId


def initial_state():
    now = datetime.now(timezone.utc)
    return EtatZone(ZoneId.RESERVE_PROPRE, Sens.SORTIE, {
        'niveau_l': Mesure(NIVEAU_RESERVE_L, 'L', CodeQualite.VALIDE, now),
        'ph': Mesure(sum(CONSIGNE_PH) / 2, 'pH', CodeQualite.VALIDE, now),
        'ec': Mesure(sum(CONSIGNE_EC) / 2, 'mS/cm', CodeQualite.VALIDE, now),
        'temperature': Mesure(sum(TEMP_EAU_CIBLE) / 2, '°C', CodeQualite.VALIDE, now),
    })


def records_from_states(states, simulated_at):
    records = []
    for state in states:
        for name, measure in state.mesures.items():
            records.append({
                'zone': state.zone.value, 'sens': state.sens.value,
                'mesure': name, 'valeur': measure.valeur, 'unite': measure.unite,
                'qualite': measure.qualite.value,
                'timestamp': simulated_at.isoformat(),
            })
    return records


class SimulationService:
    def __init__(self, serre='S001'):
        self.serre = serre
        self._lock = threading.RLock()
        self._stop = threading.Event()
        self._thread = None
        self.last_error = None
        self.history = deque(maxlen=900)
        self.events = deque(maxlen=200)
        self._event_id = 0
        self._reset()

    def _event(self, message):
        self._event_id += 1
        self.events.append({'id': self._event_id,
                            'date': datetime.now(timezone.utc).isoformat(),
                            'message': message})

    def _reset(self):
        self.reserve = initial_state()
        self.started_at = datetime.now(timezone.utc)
        self.sim_seconds = 0
        self.accumulator = 0.0
        self.speed = 1
        self.paused = False
        self.pump_on = True
        self.scenario = 'normal'
        self.zones = []
        self.history.clear()
        self._event('Simulation initialisée — valeurs synthétiques')
        self._build_zones(advance=False)
        self.last_update = time.time()
        self._remember()

    def _build_zones(self, advance=True):
        if advance:
            self.reserve = tick_reserve_propre(self.reserve, 1.0)
        cuve = tick_cuve_nutritive(self.reserve, 1.0)
        pompe = tick_sortie_pompe(cuve, 1.0)
        active = self.pump_on and self.scenario != 'pump_failure'
        if not active:
            pompe.mesures['debit_l_s'].valeur = 0.0
            pompe.mesures['pression_bar'].valeur = 0.0
        climat = tick_climat(pompe, 1.0)
        retour = tick_retour(climat, 1.0)
        self.zones = [deepcopy(self.reserve), cuve, pompe, climat, retour]
        # Approximation de Dewi : seul le retour d'EC reboucle vers la réserve.
        # Aucune recirculation d'EC quand la pompe est arrêtée.
        if advance and active:
            self.reserve.mesures['ec'] = deepcopy(retour.mesures['ec'])

    def advance(self, real_seconds):
        if not math.isfinite(real_seconds) or not 0 <= real_seconds <= 10:
            raise ValueError('Le pas réel doit être compris entre 0 et 10 secondes')
        with self._lock:
            if self.paused:
                return
            self.accumulator += real_seconds * self.speed
            count = int(self.accumulator)
            self.accumulator -= count
            for _ in range(count):
                self._build_zones()
                self.sim_seconds += 1
            if count:
                self.last_update = time.time()
                self._remember()

    def _remember(self):
        s = self.snapshot()
        self.history.append({
            'timestamp': s['observed_at'], 'sim_seconds': self.sim_seconds,
            'niveau': s['niveau']['value'], 'temperature': s['temperature']['value'],
            'ph': s['ph']['value'], 'ec': s['ec']['value'],
            'debit': s['debit']['value'], 'pression': s['pression']['value'],
        })

    def snapshot(self):
        with self._lock:
            at = self.started_at + timedelta(seconds=self.sim_seconds)
            records = records_from_states(self.zones, at)
            def value(zone, name):
                return next(r['valeur'] for r in records
                            if r['zone'] == zone and r['mesure'] == name)
            level = 100 * value('reserve_propre', 'niveau_l') / NIVEAU_RESERVE_L
            temp = value('cuve_nutritive', 'temperature')
            ph = value('cuve_nutritive', 'ph')
            ec = value('cuve_nutritive', 'ec')
            active = self.pump_on and self.scenario != 'pump_failure'
            def field(v, unit, ok=True):
                return {'value': round(v, 3), 'unit': unit, 'status': 'OK' if ok else 'ALERTE'}
            alerts = []
            if level < 40:
                alerts.append('Niveau de réserve inférieur à 40 % (seuil de démonstration)')
            if not active:
                alerts.append('Circulation interrompue : pompe arrêtée')
            if not CONSIGNE_PH[0] <= ph <= CONSIGNE_PH[1]:
                alerts.append('pH hors consigne du projet')
            if not CONSIGNE_EC[0] <= ec <= CONSIGNE_EC[1]:
                alerts.append('EC hors consigne du projet')
            if not TEMP_EAU_CIBLE[0] <= temp <= TEMP_EAU_CIBLE[1]:
                alerts.append('Température de l’eau hors consigne du projet')
            return {
                'schema_version': 1, 'source': 'simulation', 'serre': self.serre,
                'observed_at': datetime.fromtimestamp(self.last_update, timezone.utc).isoformat()
                    if hasattr(self, 'last_update') else datetime.now(timezone.utc).isoformat(),
                'simulated_at': at.isoformat(), 'records': records,
                'simulation': {'paused': self.paused, 'speed': self.speed,
                               'sim_seconds': self.sim_seconds, 'scenario': self.scenario,
                               'pump_requested': self.pump_on, 'pump_running': active,
                               'last_update_timestamp_seconds': getattr(self, 'last_update', time.time())},
                'niveau': field(level, '%', level >= 40),
                'temperature': field(temp, '°C', TEMP_EAU_CIBLE[0] <= temp <= TEMP_EAU_CIBLE[1]),
                'ph': field(ph, 'pH', CONSIGNE_PH[0] <= ph <= CONSIGNE_PH[1]),
                'ec': field(ec, 'mS/cm', CONSIGNE_EC[0] <= ec <= CONSIGNE_EC[1]),
                'debit': field(value('sortie_pompe', 'debit_l_s'), 'L/s', active),
                'pression': field(value('sortie_pompe', 'pression_bar'), 'bar', active),
                'pompe': 'ARROSAGE' if active else 'ARRÊT',
                'etatGlobal': 'ALERTE' if alerts else 'OK', 'alerts': alerts,
                'dernierEvenement': self.events[-1]['message'],
                'prochainCycle': None, 'mode': 'SIMULATION',
            }

    def get_history(self, limit=300):
        with self._lock:
            return deepcopy(list(self.history)[-limit:])

    def get_events(self):
        with self._lock:
            return deepcopy(list(self.events))

    def command(self, body):
        if not isinstance(body, dict) or set(body) - {'action', 'value'}:
            raise ValueError('Objet attendu : action et, si nécessaire, value')
        action, value = body.get('action'), body.get('value')
        with self._lock:
            if action == 'speed':
                if type(value) is not int or value not in (1, 60, 600, 3600):
                    raise ValueError('Vitesses disponibles : 1, 60, 600 ou 3600')
                self.speed = value
            elif action == 'pump':
                if type(value) is not bool:
                    raise ValueError('pump attend true ou false')
                self.pump_on = value
            elif action == 'pause':
                self.paused = True
            elif action == 'resume':
                self.paused = False
            elif action == 'step':
                if not self.paused:
                    raise ValueError('Mettre la simulation en pause avant un pas manuel')
                self._build_zones()
                self.sim_seconds += 1
            elif action == 'scenario':
                if value not in ('normal', 'pump_failure', 'low_level'):
                    raise ValueError('Scénario inconnu')
                if value == 'normal':
                    self._reset()
                else:
                    self.scenario = value
                    if value == 'low_level':
                        self.reserve.mesures['niveau_l'].valeur = NIVEAU_RESERVE_L * 0.30
                        for zone in self.zones:
                            if 'niveau_l' in zone.mesures:
                                zone.mesures['niveau_l'].valeur = NIVEAU_RESERVE_L * 0.30
            else:
                raise ValueError('Action inconnue')
            # Les commandes ne font pas avancer le temps ni tirer de nouveaux bruits.
            active = self.pump_on and self.scenario != 'pump_failure'
            pump = next(z for z in self.zones if z.zone == ZoneId.SORTIE_POMPE)
            pump.mesures['debit_l_s'].valeur = DEBIT_NOMINAL_L_S if active else 0.0
            pump.mesures['pression_bar'].valeur = PRESSION_NOMINALE_BAR if active else 0.0
            self._event(f'{action} : {value if value is not None else "ok"}')
            self.last_update = time.time()
            self._remember()
            return self.snapshot()

    def start(self):
        if self._thread and self._thread.is_alive():
            return
        self._stop.clear()
        self._thread = threading.Thread(target=self._run, name='hydroponie', daemon=True)
        self._thread.start()

    def _run(self):
        previous = time.monotonic()
        try:
            while not self._stop.wait(1.0):
                now = time.monotonic()
                # Après une suspension du PC, pas de rattrapage massif du temps absent.
                self.advance(min(now - previous, 5.0))
                previous = now
        except Exception as exc:
            self.last_error = str(exc)
            logging.exception('Arrêt du moteur de simulation')

    def healthy(self):
        return self.last_error is None and self._thread is not None and self._thread.is_alive()

    def stop(self):
        self._stop.set()
        if self._thread:
            self._thread.join(timeout=5)
