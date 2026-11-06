# Aba Mela — Home Services & Construction Platform

A multi-portal marketplace for home services, construction teams, professionals, and suppliers in Ethiopia.

## Technology

- Frontend: React 19, TypeScript, Vite 7, Tailwind CSS 4, React Router, i18next
- Backend: ASP.NET Core 8 Web API, Entity Framework Core, PostgreSQL, JWT, BCrypt
- Maps: Leaflet / OpenStreetMap

## Run the frontend

Requirements: Node.js 20.19+ or 22.12+.

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. Set `VITE_API_URL` in `.env` if the API is not at http://localhost:5000.

## Run the API

Requirements: .NET 8 SDK and PostgreSQL.

Configure secrets before starting the API. Do not commit credentials or signing keys.

PowerShell example:

```powershell
$env:ConnectionStrings__Default="Host=localhost;Database=aba_mela;Username=postgres;Password=YOUR_LOCAL_PASSWORD"
$env:Jwt__Key="REPLACE_WITH_A_RANDOM_SECRET_AT_LEAST_32_BYTES_LONG"
$env:Jwt__Issuer="AbaMela"
$env:Jwt__Audience="AbaMela"
$env:Jwt__ExpiresMinutes="60"
$env:Cors__AllowedOrigins__0="http://localhost:5173"
cd backend/AbaMela.Api
dotnet restore
dotnet run
```

The API fails fast when the database connection or a sufficiently long JWT signing key is missing. For deployment, set the same values in the hosting provider's secret/environment-variable settings and set CORS origins to the exact deployed frontend origin(s). Do not use wildcard origins with authenticated requests.

Swagger is enabled only in Development. Health endpoint: `/health`.

## Authentication

- Register through the UI as Customer, Professional, or Organization.
- Admin accounts cannot be self-registered.
- Passwords must be at least 12 characters and are hashed with BCrypt.
- Successful sign-in stores a bearer token in browser local storage and routes the user to the portal matching the account role.
- Portal layouts redirect unauthenticated users to sign-in and enforce the portal role in the UI. API authorization remains the security boundary.

For production, prefer a secure HttpOnly, Secure, SameSite cookie-based session over browser local storage, add email verification and password reset, and add rate limiting / account lockout before public launch.

## Portals

| Portal | Route |
|---|---|
| Public site | `/` |
| Sign in / Register | `/login` · `/register` |
| Customer | `/customer` |
| Professional | `/professional` |
| Organization / Construction | `/organization` |
| Suppliers | `/suppliers` |

## API endpoints currently implemented

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/services`
- `GET /api/bookings`, `POST /api/bookings`, `GET /api/bookings/{id}`
- `POST /api/bookings/{id}/accept`, `PATCH /api/bookings/{id}/status`
- `GET /api/projects`, `GET /api/projects/{id}`, `POST /api/projects`

Booking and project APIs now apply server-side role and ownership checks. Project ownership currently maps an Organization account's user ID to `OrganizationId`; a future organization-membership model is needed for multiple staff accounts per organization.

## Current implementation notes

The repository includes portal screens and sample/mock data. A screen being present does not mean its workflow is connected to persistent API data or a payment provider. Payment processing, live dispatch, messaging, supplier transactions, file uploads, notifications, and production-grade AI integrations require separate end-to-end implementation and testing.

Before public deployment:
1. Provision PostgreSQL and apply the database schema/migrations.
2. Configure environment secrets and production CORS origins.
3. Add database migrations, rate limiting, email verification, password reset, audit logging, and monitoring.
4. Replace mock-data workflows with authenticated API calls.
5. Run frontend lint/build and backend tests against a staging database.
6. Conduct authorization, privacy, and payment-provider security reviews.

## Languages

English, Amharic, Arabic (RTL), and French.
