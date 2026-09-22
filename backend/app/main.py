from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes_plant import router as plant_router
from app.api.routes_type import router as type_router

app = FastAPI(title="Projet Odyssée")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # port par défaut de Vite
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(plant_router)
app.include_router(type_router)


@app.get("/api/health")
def health():
    return {"status": "ok"}