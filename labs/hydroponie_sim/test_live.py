"""Tests du moteur et des échanges HTTP, exécutables sans dépendances."""
import importlib.util
import json
from pathlib import Path
import random
import sys
import threading
import unittest
from urllib.error import HTTPError
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from app.simulation.live import SimulationService
from app.simulation.metrics import exposition, escape_label
from app.domain.simulation import _bruit

spec = importlib.util.spec_from_file_location('lab_server', Path(__file__).with_name('server.py'))
server_module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(server_module)


class EngineTests(unittest.TestCase):
    def test_acceleration_preserves_fixed_steps(self):
        random.seed(37)
        slow = SimulationService()
        for _ in range(60):
            slow.advance(1)
        random.seed(37)
        fast = SimulationService()
        fast.command({'action': 'speed', 'value': 60})
        fast.advance(1)
        a, b = slow.snapshot(), fast.snapshot()
        self.assertEqual(a['simulation']['sim_seconds'], 60)
        self.assertEqual(b['simulation']['sim_seconds'], 60)
        self.assertEqual([r['valeur'] for r in a['records']], [r['valeur'] for r in b['records']])

    def test_pause_manual_step_and_resume(self):
        s = SimulationService()
        s.command({'action': 'pause'})
        before = s.snapshot()['records']
        s.advance(5)
        self.assertEqual(s.snapshot()['records'], before)
        s.command({'action': 'step'})
        self.assertEqual(s.snapshot()['simulation']['sim_seconds'], 1)
        s.command({'action': 'resume'})
        s.advance(1)
        self.assertEqual(s.snapshot()['simulation']['sim_seconds'], 2)
        with self.assertRaises(ValueError):
            s.command({'action': 'step'})

    def test_pump_failure_is_shared_by_json_and_metrics(self):
        s = SimulationService()
        s.command({'action': 'scenario', 'value': 'pump_failure'})
        s.advance(2)
        state = s.snapshot()
        self.assertEqual(state['debit']['value'], 0)
        self.assertEqual(state['pression']['value'], 0)
        self.assertFalse(state['simulation']['pump_running'])
        text = exposition(state).decode()
        self.assertIn('hydroponie_pompe_active{serre="S001"} 0', text)
        self.assertIn('hydroponie_debit_m3_per_second{serre="S001",zone="sortie_pompe",sens="sortie"} 0', text)
        s.command({'action': 'scenario', 'value': 'normal'})
        self.assertGreater(s.snapshot()['debit']['value'], 0)

    def test_low_level_and_history_bound(self):
        s = SimulationService()
        s.command({'action': 'scenario', 'value': 'low_level'})
        self.assertAlmostEqual(s.snapshot()['niveau']['value'], 30)
        self.assertEqual(s.snapshot()['etatGlobal'], 'ALERTE')
        for _ in range(950):
            s.advance(1)
        self.assertEqual(len(s.get_history(900)), 900)
        records = s.snapshot()['records']
        volume = next(r['valeur'] for r in records if r['zone'] == 'reserve_propre' and r['mesure'] == 'niveau_l')
        self.assertTrue(0 <= volume <= 1210)

    def test_reject_invalid_commands_without_mutating_state(self):
        s = SimulationService()
        before = s.snapshot()
        for body in ({'action': 'speed', 'value': True}, {'action': 'speed', 'value': 3600},
                     {'action': 'pump', 'value': 'false'}, {'action': 'scenario', 'value': 'unknown'}, []):
            with self.assertRaises(ValueError):
                s.command(body)
        self.assertEqual(s.snapshot(), before)

    def test_units_are_converted_for_prometheus(self):
        s = SimulationService().snapshot()
        # Données du JSON et données de Prometheus : même état, unités différentes.
        text = exposition(s).decode()
        for r in s['records']:
            if r['zone'] == 'sortie_pompe' and r['mesure'] == 'pression_bar':
                line = next(l for l in text.splitlines() if l.startswith('hydroponie_pression_pascals{'))
                self.assertAlmostEqual(float(line.rsplit(' ', 1)[1]), r['valeur'] * 100000)
        self.assertTrue(text.endswith('\n'))
        self.assertEqual({r['zone'] for r in s['records']},
                         {'reserve_propre', 'cuve_nutritive', 'sortie_pompe', 'climat', 'retour'})
        self.assertEqual(escape_label('x"\\\ny'), 'x\\"\\\\\\ny')

    def test_noise_is_bounded(self):
        self.assertTrue(all(-0.02 <= _bruit(0.02) <= 0.02 for _ in range(1000)))


class HttpTests(unittest.TestCase):
    def setUp(self):
        self.service = SimulationService()
        self.service.start()
        self.server = server_module.ThreadingHTTPServer(('127.0.0.1', 0), server_module.handler_for(self.service, 'test-token'))
        self.thread = threading.Thread(target=self.server.serve_forever, daemon=True)
        self.thread.start()
        self.base = f'http://127.0.0.1:{self.server.server_port}'

    def tearDown(self):
        self.server.shutdown()
        self.server.server_close()
        self.service.stop()
        self.thread.join()

    def call(self, path, body=None, token='test-token'):
        headers = {'Content-Type': 'application/json', 'X-Simulation-Token': token}
        req = Request(self.base + path, data=json.dumps(body).encode() if body is not None else None, headers=headers)
        return urlopen(req, timeout=3)

    def test_http_json_metrics_and_command_agree(self):
        with self.call('/api/health') as response:
            self.assertEqual(json.load(response)['status'], 'ok')
        with self.call('/api/simulation', {'action': 'pump', 'value': False}) as response:
            state = json.load(response)
            self.assertEqual(state['debit']['value'], 0)
        with self.call('/api/state') as response:
            self.assertEqual(json.load(response)['pompe'], 'ARRÊT')
        with self.call('/metrics') as response:
            self.assertIn('version=0.0.4', response.headers['Content-Type'])
            self.assertIn('hydroponie_pompe_active{serre="S001"} 0', response.read().decode())

    def test_http_rejects_unauthed_controls_and_bad_limits(self):
        for path, body, token, expected in (
            ('/api/simulation', {'action': 'pause'}, '', 401),
            ('/api/simulation', {'action': 'speed', 'value': 3600}, 'test-token', 400),
            ('/api/history?limit=0', None, 'test-token', 400),
            ('/api/history?limit=10000', None, 'test-token', 400),
        ):
            with self.assertRaises(HTTPError) as result:
                self.call(path, body, token)
            self.assertEqual(result.exception.code, expected)


if __name__ == '__main__':
    unittest.main()
