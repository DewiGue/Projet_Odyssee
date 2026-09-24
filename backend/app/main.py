from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from pathlib import Path

from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI

from dotenv import load_dotenv
load_dotenv()

from app.api.routes_plant import router as plant_router
from app.api.routes_type import router as type_router

import os
from pathlib import Path    


app = FastAPI(title="Projet Odyssée")

if os.getenv("ODYSSEE_ENABLE_SIMULATION") == "1":
    from app.simulation.api import build_router
    from app.simulation.live import SimulationService

    token_path = os.getenv("ODYSSEE_SIM_TOKEN_FILE")
    token = Path(token_path).read_text().strip() if token_path else os.getenv("ODYSSEE_SIM_TOKEN", "")
    app.include_router(build_router(SimulationService(), token))

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # port par défaut de Vite
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plant_router)
app.include_router(type_router)

# Activation explicite après validation du labo. Un seul worker pour ce moteur
# en mémoire ; ne pas lancer le labo et ce mode sur le même port.
if os.getenv("ODYSSEE_ENABLE_SIMULATION") == "1":
    from app.simulation.api import build_router
    from app.simulation.live import SimulationService

    token_path = os.getenv("ODYSSEE_SIM_TOKEN_FILE")
    token = Path(token_path).read_text().strip() if token_path else os.getenv("ODYSSEE_SIM_TOKEN", "")
    app.include_router(build_router(SimulationService(), token))


@app.get("/api/health")
def health():
    return {"status": "ok"}
