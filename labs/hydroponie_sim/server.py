"""Labo autonome : Python >= 3.10, sans MariaDB ni autre dépendance.

Usage depuis la racine : python labs/hydroponie_sim/server.py
"""
import argparse
import hmac
import json
import os
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
import secrets
import sys
from urllib.parse import parse_qs, urlsplit

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'backend'))
from app.simulation.live import SimulationService  # noqa: E402
from app.simulation.metrics import CONTENT_TYPE, exposition  # noqa: E402


def handler_for(service, token):
    class Handler(BaseHTTPRequestHandler):
        def reply(self, status, data, content_type='application/json; charset=utf-8'):
            payload = data if isinstance(data, bytes) else json.dumps(data, ensure_ascii=False).encode()
            self.send_response(status)
            self.send_header('Content-Type', content_type)
            self.send_header('Content-Length', str(len(payload)))
            self.send_header('Cache-Control', 'no-store')
            self.send_header('X-Content-Type-Options', 'nosniff')
            self.end_headers()
            self.wfile.write(payload)

        def do_GET(self):
            url = urlsplit(self.path)
            if url.path == '/api/state':
                self.reply(200, service.snapshot())
            elif url.path == '/api/history':
                try:
                    limit = int(parse_qs(url.query).get('limit', ['300'])[0])
                    if not 1 <= limit <= 900:
                        raise ValueError()
                except ValueError:
                    self.reply(400, {'detail': 'limit doit être compris entre 1 et 900'})
                    return
                self.reply(200, service.get_history(limit))
            elif url.path == '/api/events':
                self.reply(200, service.get_events())
            elif url.path == '/api/health':
                ok = service.healthy()
                self.reply(200 if ok else 503, {'status': 'ok' if ok else 'error', 'source': 'simulation'})
            elif url.path == '/metrics':
                if service.last_error:
                    self.reply(503, {'detail': 'Simulation arrêtée sur erreur'})
                else:
                    self.reply(200, exposition(service.snapshot()), CONTENT_TYPE)
            else:
                self.reply(404, {'detail': 'Endpoints : /api/state, /api/history, /api/events, /metrics'})

        def do_POST(self):
            if urlsplit(self.path).path != '/api/simulation':
                self.reply(404, {'detail': 'Route inconnue'})
                return
            supplied = self.headers.get('X-Simulation-Token', '')
            if not token or not hmac.compare_digest(supplied.encode(), token.encode()):
                self.reply(401, {'detail': 'Jeton de commande invalide ou absent'})
                return
            if self.headers.get_content_type() != 'application/json':
                self.reply(415, {'detail': 'Content-Type: application/json requis'})
                return
            try:
                length = int(self.headers.get('Content-Length', '0'))
                if not 0 < length <= 2048:
                    raise ValueError('Corps JSON attendu, maximum 2048 octets')
                body = json.loads(self.rfile.read(length))
                self.reply(200, service.command(body))
            except (ValueError, UnicodeError) as exc:
                self.reply(400, {'detail': str(exc)})

        def log_message(self, fmt, *args):
            # Les scrapes/pollings ne remplissent pas les journaux chaque seconde.
            if len(args) > 1 and str(args[1]) not in ('200', '304'):
                super().log_message(fmt, *args)

    return Handler


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--host', default='127.0.0.1')
    parser.add_argument('--port', type=int, default=8000)
    parser.add_argument('--serre', default='S001')
    parser.add_argument('--token-file', type=Path, default=Path(__file__).with_name('.control-token'))
    args = parser.parse_args()
    if not args.token_file.exists():
        fd = os.open(args.token_file, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
        with os.fdopen(fd, 'w') as f:
            f.write(secrets.token_urlsafe(32) + '\n')
    token = args.token_file.read_text().strip()
    if not token:
        parser.error('Fichier de jeton vide')
    service = SimulationService(args.serre)
    server = ThreadingHTTPServer((args.host, args.port), handler_for(service, token))
    service.start()
    print(f'Simulation : http://{args.host}:{args.port}/api/state', flush=True)
    print(f'Prometheus : http://{args.host}:{args.port}/metrics', flush=True)
    print(f'Jeton de commande dans {args.token_file.resolve()}', flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
        service.stop()


if __name__ == '__main__':
    main()
