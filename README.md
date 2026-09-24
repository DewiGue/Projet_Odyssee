# Projet Odyssée

Projet de supervision et de gestion d'une installation de culture hydroponique.

L'application est composée de trois éléments principaux :

* **Frontend** : React avec Vite
* **Backend** : Python avec FastAPI
* **Base de données** : MariaDB

Le frontend et le backend sont séparés afin d'avoir des dépendances et des environnements de développement indépendants.

---

## Architecture

```text
Projet_Odyssee/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── db/
│   │   ├── domain/
│   │   ├── repositories/
│   │   └── simulation/
│   │
│   ├── migrations/
│   ├── tests/
│   ├── .env.example
│   ├── requirements.txt
│   ├── alembic.ini
│   └── run_simulation.py
│
├── Front/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── mocks/
│   │   └── pages/
│   │
│   ├── package.json
│   ├── package-lock.json
│   └── vite.config.js
│
├── projet_odyssee.sql
└── README.md
```

### Fonctionnement

```text
React / Vite
localhost:5173
      │
      │ /api
      ▼
FastAPI
localhost:8000
      │
      ▼
SQLAlchemy
      │
      ▼
MariaDB
localhost:3306
```

Le frontend utilise le proxy Vite pour communiquer avec le backend via les routes `/api`.

---

# Prérequis

Installer les éléments suivants :

* Python 3.13
* Node.js et npm
* MariaDB 10.11.x

Vérifier les installations :

```bash
python --version
node --version
npm --version
mariadb --version
```

---

# 1. Base de données

Le projet utilise une base MariaDB appelée :

```text
projet_odyssee
```

Le fichier `projet_odyssee.sql` contient le schéma de la base ainsi que des données de démonstration.

## Création de la base

Se connecter à MariaDB :

```bash
mariadb -u root -p
```

Créer la base :

```sql
CREATE DATABASE projet_odyssee
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;
```

Quitter MariaDB :

```sql
EXIT;
```

## Import du projet

Depuis la racine du projet :

```bash
mariadb -u root -p projet_odyssee < projet_odyssee.sql
```

La base contient notamment les tables :

```text
Plant
Type
Users
```

---

# 2. Backend

Le backend se trouve dans le dossier :

```text
backend/
```

Il utilise principalement :

* Python
* FastAPI
* SQLAlchemy
* PyMySQL
* Pydantic
* Uvicorn

## Création de l'environnement Python

Depuis la racine du projet :

```bash
cd backend
python -m venv .venv
```

### Windows

```powershell
.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

## Installation des dépendances

```bash
pip install -r requirements.txt
```

---

# 3. Configuration du backend

Copier le fichier d'exemple :

### Windows

```powershell
Copy-Item .env.example .env
```

### Linux / macOS

```bash
cp .env.example .env
```

Modifier ensuite le fichier `.env`.

Exemple :

```env
DATABASE_URL=mysql+pymysql://root:root@localhost:3306/projet_odyssee

ODYSSEE_ENABLE_SIMULATION=1
ODYSSEE_SIM_TOKEN=change-moi-un-vrai-jeton
```

Adapter l'utilisateur et le mot de passe MariaDB à votre installation.

---

# 4. Lancement du backend

Depuis le dossier `backend` :

```bash
uvicorn app.main:app --reload
```

Le backend est disponible à l'adresse :

```text
http://localhost:8000
```

Documentation de l'API :

```text
http://localhost:8000/docs
```

Documentation alternative :

```text
http://localhost:8000/redoc
```

Test de fonctionnement :

```text
http://localhost:8000/api/health
```

---

# 5. Frontend

Le frontend se trouve dans :

```text
Front/
```

Il utilise notamment :

* React
* Vite
* React Router
* TanStack React Query
* Recharts
* Tailwind CSS
* Lucide React

## Installation

Ouvrir un nouveau terminal puis :

```bash
cd Front
```

Installer les dépendances :

```bash
npm ci
```

---

# 6. Lancement du frontend

Depuis le dossier `Front` :

```bash
npm run dev
```

Le frontend est disponible à l'adresse :

```text
http://localhost:5173
```

Le frontend communique automatiquement avec le backend grâce au proxy configuré dans `vite.config.js`.

Les requêtes :

```text
/api/...
```

sont redirigées vers :

```text
http://localhost:8000
```

---

# 7. Simulation

Le backend contient un système de simulation permettant de reproduire le fonctionnement de l'installation hydroponique.

La simulation peut être activée dans `.env` :

```env
ODYSSEE_ENABLE_SIMULATION=1
```

Elle peut également être exécutée indépendamment avec :

```bash
cd backend
python run_simulation.py
```

Exemple :

```bash
python run_simulation.py --ticks 100 --dt 1 --out simulation_output.json
```

---

# 8. Tests

Les tests du backend se trouvent dans :

```text
backend/tests/
```

Pour les exécuter :

```bash
cd backend
pytest
```

---

# 9. Migrations

Le projet contient également une configuration Alembic :

```text
backend/
├── alembic.ini
└── migrations/
```

Pour appliquer les migrations :

```bash
cd backend
alembic upgrade head
```

Cependant, pour une installation correspondant à l'état actuel du projet, il est recommandé d'utiliser le fichier :

```text
projet_odyssee.sql
```

Celui-ci contient notamment les données de démonstration et certains éléments qui ne sont pas encore présents dans les migrations Alembic.

---

# Installation complète

Pour installer le projet sur une nouvelle machine :

## Base de données

```bash
mariadb -u root -p
```

```sql
CREATE DATABASE projet_odyssee;
```

Puis :

```bash
mariadb -u root -p projet_odyssee < projet_odyssee.sql
```

## Backend

```bash
cd backend
python -m venv .venv
```

Windows :

```powershell
.venv\Scripts\activate
```

Linux / macOS :

```bash
source .venv/bin/activate
```

Puis :

```bash
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

## Frontend

Dans un second terminal :

```bash
cd Front
npm ci
npm run dev
```

L'application est alors accessible sur :

```text
http://localhost:5173
```

Le backend est accessible sur :

```text
http://localhost:8000
```

Et la documentation de l'API sur :

```text
http://localhost:8000/docs
```

---

# Technologies

| Partie          | Technologie      |
| --------------- | ---------------- |
| Frontend        | React            |
| Bundler         | Vite             |
| Backend         | Python / FastAPI |
| ORM             | SQLAlchemy       |
| Base de données | MariaDB          |
| Driver BDD      | PyMySQL          |
| Migrations      | Alembic          |
| Tests           | pytest           |
| Simulation      | Python           |
