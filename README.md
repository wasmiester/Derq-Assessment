# Derq Assessment – Wasi Raza

A full-stack traffic analytics dashboard. The backend is a Node.js/Express REST API connected to PostgreSQL. The frontend is a React app built with Vite that displays live charts and a form for logging new traffic entries.

---

## Stack

- **Frontend** – React 19, Vite, Chart.js
- **Backend** – Node.js, Express 5, PostgreSQL (via `pg`)
- **Database** – PostgreSQL 15
- **Testing** – Vitest, Supertest, React Testing Library
- **Containerisation** – Docker Compose
- **CI/CD** – GitHub Actions

---

## Prerequisites

- [Node.js]
- [Docker Desktop]

---

## Setup

**1. Clone the repo**
```bash
git clone https://github.com/wasmiester/Derq-Assessment.git
cd Derq-Assessment
```

**2. Install dependencies**
```bash
npm install
```

**3. Create a `.env` file** in the project root:
```
API_PORT=5000
FRONTEND_PORT=3000

DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=universal_traffic
DB_PORT=5432
DB_HOST=localhost
```

---

## Running the app

### Using Docker (recommended)

Start the database, API, and frontend all at once:
```bash
docker-compose up
```

Seed the database with sample data (first time only):
```bash
docker-compose --profile setup up seeder
```

---

### Running Local

**Terminal 1 – Database**
```bash
docker-compose up database
```

**Terminal 2 – Backend**
```bash
npm run dev:backend
```

**Terminal 3 – Frontend**
```bash
npm run dev:frontend
```

Seed sample data (first time only):
```bash
npm run seed
```

---

## API Endpoints

| Method | Route            | Description                       |
|--------|------------------|-----------------------------------|
| GET    | `/api/test`      | Returns first 5 rows              |
| GET    | `/country`       | Traffic totals grouped by country |
| GET    | `/vehicle`       | Traffic totals grouped by type    |
| GET    | `/trends`        | Daily traffic totals over time    |
| GET    | `/vehicle-types` | Distinct vehicle types (dropdown) |
| POST   | `/traffic`       | Insert a new traffic record       |

**POST `/traffic` body:**
```json
{
  "country_code": "US",
  "vehicle_type": "Car",
  "traffic_vol": 5000,
  "rec_time": "2024-01-15T10:30:00.000Z"
}
```

---

## Testing

Run all tests:
```bash
npm test
```

Run backend tests only:
```bash
npm run test:backend
```

Run frontend tests only:
```bash
npm run test:frontend
```

Or use the PowerShell script for a summary view:
```powershell
.\run-tests.ps1
```

---

## CI/CD

The project uses GitHub Actions with two jobs that run on every push or pull request to `main`.

### test
Spins up a real PostgreSQL 15 instance, runs the DB migration, lints the code, and runs the full test suite.

### build
Runs only on pushes to `main` after `test` passes. Builds all Docker images to verify the containers are healthy.

The workflow file is at `.github/workflows/ci.yml`.

---
