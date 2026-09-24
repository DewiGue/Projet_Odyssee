"""Adaptateur optionnel FastAPI. Le moteur reste indépendant du framework."""
from contextlib import asynccontextmanager
import hmac

from fastapi import APIRouter, Body, Header, HTTPException, Query, Response
from app.simulation.metrics import CONTENT_TYPE, exposition


def build_router(service, token=''):
    @asynccontextmanager
    async def lifespan(_app):
        service.start()
        try:
            yield
        finally:
            service.stop()

    router = APIRouter(tags=['simulation'], lifespan=lifespan)

    @router.get('/api/state')
    def state():
        return service.snapshot()

    @router.get('/api/history')
    def history(limit: int = Query(default=300, ge=1, le=900)):
        return service.get_history(limit)

    @router.get('/api/events')
    def events():
        return service.get_events()

    @router.get('/api/simulation/health')
    def health():
        if not service.healthy():
            raise HTTPException(503, 'Simulation inactive')
        return {'status': 'ok', 'source': 'simulation'}

    @router.post('/api/simulation')
    def command(body: dict = Body(...), x_simulation_token: str = Header(default='')):
        if not token or not hmac.compare_digest(x_simulation_token.encode(), token.encode()):
            raise HTTPException(401, 'Jeton de commande invalide ou absent')
        try:
            return service.command(body)
        except ValueError as exc:
            raise HTTPException(400, str(exc)) from exc

    @router.get('/metrics')
    def metrics():
        if service.last_error:
            raise HTTPException(503, 'Simulation arrêtée sur erreur')
        return Response(content=exposition(service.snapshot()), headers={'Content-Type': CONTENT_TYPE})

    return router
