from datetime import date, datetime

from sqlalchemy import (
    Integer,
    String,
    Text,
    Boolean,
    Date,
    DateTime,
    Numeric,
    ForeignKey,
)
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class TypeORM(Base):
    __tablename__ = "Type"

    Id_Type: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    # Informations générales
    nom: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    variete: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    famille: Mapped[str] = mapped_column(
        String(100),
        nullable=False
    )

    systeme_culture: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    ph_min: Mapped[float] = mapped_column(
        Numeric(4, 2),
        nullable=False
    )

    ph_max: Mapped[float] = mapped_column(
        Numeric(4, 2),
        nullable=False
    )

    ec_min: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False
    )

    ec_max: Mapped[float] = mapped_column(
        Numeric(5, 2),
        nullable=False
    )

    # Température de l'eau
    temp_eau_min: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    temp_eau_max: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    # -------------------------
    # Paramètres de l'air
    # -------------------------

    temp_air_min: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    temp_air_max: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    humidite_min: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    humidite_max: Mapped[float | None] = mapped_column(
        Numeric(5, 2),
        nullable=True
    )

    co2_min: Mapped[float | None] = mapped_column(
        Numeric(7, 2),
        nullable=True
    )

    co2_max: Mapped[float | None] = mapped_column(
        Numeric(7, 2),
        nullable=True
    )

    # -------------------------
    # Éclairage
    # -------------------------

    ppfd_min: Mapped[float | None] = mapped_column(
        Numeric(8, 2),
        nullable=True
    )

    ppfd_max: Mapped[float | None] = mapped_column(
        Numeric(8, 2),
        nullable=True
    )

    photoperiode_heures: Mapped[float | None] = mapped_column(
        Numeric(4, 2),
        nullable=True
    )

    # -------------------------
    # Cycle de culture
    # -------------------------

    cycle_culture_jours: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    # -------------------------
    # Production
    # -------------------------

    rendement_min_kg_m2: Mapped[float | None] = mapped_column(
        Numeric(10, 3),
        nullable=True
    )

    rendement_max_kg_m2: Mapped[float | None] = mapped_column(
        Numeric(10, 3),
        nullable=True
    )

    besoin_eau_l_kg: Mapped[float | None] = mapped_column(
        Numeric(10, 3),
        nullable=True
    )

    # -------------------------
    # Gestion
    # -------------------------

    actif: Mapped[bool] = mapped_column(
        Boolean,
        nullable=False,
        default=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    # Relation Type -> Plant
    plants: Mapped[list["PlantORM"]] = relationship(
        back_populates="type"
    )


class PlantORM(Base):
    __tablename__ = "Plant"

    Id_Plant: Mapped[int] = mapped_column(
        Integer,
        primary_key=True
    )

    # -------------------------
    # Dates
    # -------------------------

    date_semis: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    date_plantation: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    date_recolte_prevue: Mapped[date | None] = mapped_column(
        Date,
        nullable=True
    )

    #date_recolte: Mapped[date | None] = mapped_column(
    #    Date,
    #    nullable=True
    #)

    # -------------------------
    # Quantité
    # -------------------------

    quantite: Mapped[float] = mapped_column(
        Numeric(10, 3),
        nullable=False
    )

    unite_quantite: Mapped[str] = mapped_column(
        String(20),
        nullable=False
    )

    # -------------------------
    # État de la plante
    # -------------------------

    statut: Mapped[str] = mapped_column(
        String(30),
        nullable=False
    )

    notes: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    # -------------------------
    # Gestion
    # -------------------------

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        nullable=False
    )

    # -------------------------
    # Relation avec Type
    # -------------------------

    Id_Type: Mapped[int | None] = mapped_column(
        ForeignKey("Type.Id_Type"),
        nullable=True
    )

    type: Mapped["TypeORM | None"] = relationship(
        back_populates="plants"
    )