"""Exposition Prometheus 0.0.4 à partir du même instantané que l'API JSON.

Le format texte officiel ne nécessite aucune dépendance Python supplémentaire.
Valeurs numériques uniquement ; pas d'horodatage simulé envoyé à Prometheus.
"""
import math

CONTENT_TYPE = 'text/plain; version=0.0.4; charset=utf-8'
METRICS = {
    'niveau_l': ('hydroponie_volume_eau_m3', 'Volume du réservoir en m3', 0.001),
    'ph': ('hydroponie_ph', 'pH de la solution', 1),
    'ec': ('hydroponie_conductivite_siemens_per_meter', 'Conductivité en S/m', 0.1),
    'temperature': ('hydroponie_temperature_eau_celsius', 'Température de l’eau en °C', 1),
    'temp_air': ('hydroponie_temperature_air_celsius', 'Température de l’air en °C', 1),
    'humidite': ('hydroponie_humidite_ratio', 'Humidité relative de 0 à 1', 0.01),
    'debit_l_s': ('hydroponie_debit_m3_per_second', 'Débit volumique en m3/s', 0.001),
    'pression_bar': ('hydroponie_pression_pascals', 'Pression en Pa', 100000),
}


def escape_label(value):
    return str(value).replace('\\', '\\\\').replace('\n', '\\n').replace('"', '\\"')


def exposition(snapshot):
    lines = []
    def family(name, help_text, samples):
        lines.extend([f'# HELP {name} {help_text}', f'# TYPE {name} gauge'])
        for labels, value in samples:
            if value is None or not math.isfinite(float(value)):
                continue
            label_text = ','.join(f'{k}="{escape_label(v)}"' for k, v in labels.items())
            lines.append(f'{name}{{{label_text}}} {float(value):.12g}')
    for key, (name, help_text, scale) in METRICS.items():
        family(name, help_text, [
            ({'serre': snapshot['serre'], 'zone': r['zone'], 'sens': r['sens']}, r['valeur'] * scale)
            for r in snapshot['records'] if r['mesure'] == key
            and r['valeur'] is not None and r['qualite'] != 'MANQUANTE'
        ])
    sim = snapshot['simulation']
    for name, field, description in (
        ('hydroponie_pompe_active', 'pump_running', 'Pompe en marche (1) ou arrêtée (0)'),
        ('hydroponie_simulation_pause', 'paused', 'Simulation en pause (1)'),
        ('hydroponie_simulation_vitesse', 'speed', 'Multiplicateur de temps simulé'),
        ('hydroponie_simulation_temps_seconds', 'sim_seconds', 'Temps simulé écoulé'),
        ('hydroponie_dernier_etat_timestamp_seconds', 'last_update_timestamp_seconds', 'Date réelle du dernier état'),
    ):
        family(name, description, [({'serre': snapshot['serre']}, sim[field])])
    return ('\n'.join(lines) + '\n').encode('utf-8')
