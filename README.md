# Mela — Kansas City Home Services & Property Platform

Mela is a multi-portal marketplace concept for homeowners, property managers, service professionals, construction organizations, and suppliers across the Kansas City metropolitan area in Missouri and Kansas.

> **Demo status:** This repository contains demo workflows and sample data. Sample names, providers, jobs, ratings, properties, and prices are illustrative only. They are not real listings, verified contractors, live availability, or market quotes. Do not use this demo setup for production.

## Dedicated local development ports

Mela uses its own ports so it can run beside your other applications without taking their ports:

| Service | Local address |
|---|---|
| Frontend | http://localhost:5178 |
| API health | http://localhost:5018/health |
| API Swagger | http://localhost:5018/swagger |
| PostgreSQL | localhost:5448 |

The ports inside Docker containers remain the standard service ports. Only the host-side ports are unique to Mela.

## Open and run in VS Code (recommended)

The easiest setup uses **Docker Desktop**. It runs the React frontend, ASP.NET Core API, and PostgreSQL database together. You do **not** need to install .NET 8 on Windows when using this option.

### 1. Install prerequisites
- [Visual Studio Code](https://code.visualstudio.com/)
- [Git for Windows](https://git-scm.com/download/win)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — start it and wait until Docker is running.

### 2. Download the project
Choose **Code → Download ZIP** on GitHub and extract it, or run:

```powershell
git clone https://github.com/Ella-tec/aba-mela.git
cd aba-mela
code .
```

If `code` is not recognized, open VS Code → **File → Open Folder** and select the extracted `aba-mela` folder.

### 3. Start the complete application
In VS Code choose **Terminal → New Terminal** and run:

```powershell
docker compose up --build
```

Then open:
- Frontend: http://localhost:5178
- API health: http://localhost:5018/health
- API Swagger: http://localhost:5018/swagger

Stop with Ctrl+C, then run `docker compose down`. The database remains in a Docker volume. To permanently delete the local database and demo data, run `docker compose down -v`.

### VS Code task shortcuts
Use **Terminal → Run Task**:
- **Mela: Start all services (Docker)**
- **Mela: Stop all services**
- **Mela: Stop services and remove local database** (deletes demo data)

## Run only the frontend without Docker
Requirements: Node.js 22 recommended, or Node.js 20.19+.

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open http://localhost:5178. This starts only the frontend; the API and PostgreSQL must also be running for registration, login and API-backed workflows. If you run PostgreSQL locally, configure the API connection string to use port 5448 only when PostgreSQL is published by the Mela Docker Compose stack.

Build the frontend with `npm run build`; preview with `npm run preview`.

## Run the API directly on Windows (optional)
Requirements: .NET 8 SDK and PostgreSQL. Docker is easier if .NET 8 is not installed.

```powershell
$env:ConnectionStrings__Default="Host=localhost;Port=5448;Database=mela;Username=mela;Password=mela_local_dev_only"
$env:Jwt__Key="REPLACE_WITH_A_RANDOM_SECRET_AT_LEAST_32_BYTES_LONG"
$env:Jwt__Issuer="Mela"
$env:Jwt__Audience="Mela"
$env:Jwt__ExpiresMinutes="60"
$env:Cors__AllowedOrigins__0="http://localhost:5178"
dotnet run --project backend/AbaMela.Api/AbaMela.Api.csproj --urls http://localhost:5018
```

## Technology
- Frontend: React 19, TypeScript, Vite 7, Tailwind CSS 4, React Router, i18next
- Backend: ASP.NET Core 8 Web API, Entity Framework Core, PostgreSQL, JWT, BCrypt
- Maps: Leaflet / OpenStreetMap

## Demo limitations and public-launch checklist
- Sample records are illustrative, not verified providers, live job listings, real prices or guaranteed availability.
- Payment screens are placeholders. No live payment processing is enabled; do not enter real payment-card details.
- Local Docker database password and JWT key are development-only. Never deploy them or commit real secrets.
- Production requires database migrations, managed secrets, secure token/session handling, email verification, password reset, rate limiting, monitoring, backups and security review.
- Kansas and Missouri licensing, permits, insurance, tax, consumer-protection and privacy requirements vary by jurisdiction and trade. Verify providers and obtain qualified professional review before a public pilot.
- A visible screen does not prove a workflow is connected to persistent data. Complete end-to-end testing before launch.

## Troubleshooting
**Docker command not found:** Install and start Docker Desktop, then reopen the VS Code terminal.

**A Mela port is busy:** Stop the service using that port, or change the host-side mapping in `docker-compose.yml` and keep the Vite port, API CORS origin, and `VITE_API_URL` in sync.

**Frontend cannot reach the API:** Check `docker compose ps`, then open http://localhost:5018/health.

**Reset local demo data:** Run `docker compose down -v`, then `docker compose up --build`. This permanently deletes local database records.
