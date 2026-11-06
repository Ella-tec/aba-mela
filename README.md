# Mela — Kansas City Home Services & Property Platform

Mela is a multi-portal marketplace concept for homeowners, property managers, service professionals, construction organizations, and suppliers across the Kansas City metropolitan area in **Missouri and Kansas**. Kansas City, Missouri is the primary market.

> **Pilot status:** This repository contains demo workflows and sample data. Sample names, providers, jobs, ratings, properties, and prices are illustrative only. They are not real listings, verified contractors, live availability, or market quotes. Service-area cities are proposed coverage configuration and must be enabled only after operational verification.

## Kansas City market

The initial product is designed for the two-state metro, with service-area configuration for Kansas City, MO; North Kansas City, MO; Independence, MO; Lee's Summit, MO; Liberty, MO; Overland Park, KS; Olathe, KS; and Shawnee, KS. This list is a product-planning starting point, not a claim that Mela currently serves these communities.

- Default map center: Kansas City, Missouri (39.0997, -94.5786)
- Local time: America/Chicago
- Currency: USD ($)
- Address format: US street address, city, state, ZIP code
- Phone format: United States (+1)
- Map tiles: OpenStreetMap
- Default language: English; existing i18n architecture and RTL support remain available.

## Product areas

- Customer: discover services, request bookings, track work, manage home records and payments.
- Professional: job discovery, dispatch/map views, earnings, availability and verification.
- Organization: construction projects, workforce, foreman and timesheets.
- Supplier: materials catalog, orders and equipment rentals.
- Admin: operational controls and reporting (implementation in progress).

Typical service categories include plumbing, HVAC, electrical, roofing, remodeling, painting, landscaping, cleaning, handyman work, and general contracting. Actual availability and licensing/insurance status must be independently verified.

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

Requirements: .NET 8 SDK and PostgreSQL. Configure secrets before starting; never commit credentials or signing keys.

PowerShell example:

```powershell
$env:ConnectionStrings__Default="Host=localhost;Database=mela;Username=postgres;Password=YOUR_LOCAL_PASSWORD"
$env:Jwt__Key="REPLACE_WITH_A_RANDOM_SECRET_AT_LEAST_32_BYTES_LONG"
$env:Jwt__Issuer="Mela"
$env:Jwt__Audience="Mela"
$env:Jwt__ExpiresMinutes="60"
$env:Cors__AllowedOrigins__0="http://localhost:5173"
cd backend/AbaMela.Api
dotnet restore
dotnet run
```

The API fails fast when the database connection or a sufficiently long JWT signing key is missing. Set production CORS origins to the exact deployed frontend origin(s). Swagger is enabled only in Development. Health endpoint: `/health`.

## Authentication and security

- Public registration is limited to Customer, Professional, and Organization; admin accounts cannot self-register.
- Passwords must be at least 12 characters and are hashed with BCrypt.
- Portal layouts require a session and enforce the portal role in the UI; API authorization remains the security boundary.
- Production should use a secure HttpOnly, Secure, SameSite cookie-based session, email verification, password reset, rate limiting, account lockout, audit logging and monitoring.

## Portals

| Portal | Route |
|---|---|
| Public site | `/` |
| Sign in / Register | `/login` · `/register` |
| Customer | `/customer` |
| Professional | `/professional` |
| Organization / Construction | `/organization` |
| Suppliers | `/suppliers` |

## Kansas and Missouri operating considerations

Contractor licensing, trade-specific permits, insurance requirements, sales/use tax, consumer protection and data/privacy obligations can differ by state, city and type of work. Mela must not claim a provider is licensed or insured without current evidence and jurisdiction-specific verification. Obtain professional legal/accounting review before public launch.

Do not store payment-card data. Payment methods shown in demo screens are placeholders; no live payment processing is implied. Integrate a payment provider only with verified server-side webhooks and tested payment/refund flows.

## Before a public Kansas City pilot

1. Confirm the initial service-area cities and ZIP codes, then enable them through configuration.
2. Replace sample data with real providers only after consent, identity, license/insurance and service-area checks.
3. Add database migrations and integration tests for booking, project, supplier, authorization and ownership flows.
4. Complete payment-provider, notification, messaging, file-upload and support integrations.
5. Run frontend lint/build and backend restore/build/test against a staging database.
6. Review Kansas/Missouri legal, tax, insurance and consumer-protection requirements with qualified professionals.

## Project status

The repository includes working UI routes, sample/demo data and an ASP.NET API foundation. A visible screen is not proof that its workflow is connected to persistent data. Several booking, dispatch, supplier, payment and notification workflows still require end-to-end implementation and verification.
