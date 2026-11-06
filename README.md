# Aba Mela — Complete Platform

**Home services · Construction · Workforce · Suppliers · AI** for Ethiopia  
Languages: English · Amharic · Arabic (RTL) · French

---

## Quick start (Frontend)

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Quick start (Backend API)

```bash
cd backend/AbaMela.Api
# Requires .NET 8 SDK + PostgreSQL
# Edit appsettings.json connection string if needed
dotnet restore
dotnet run
```

Swagger UI: http://localhost:5xxx/swagger  
Health: `/health`

Alternative: apply `backend/supabase/schema.sql` on a Supabase project.

---

## What's included

### Portals
| Portal | Path |
|--------|------|
| Public site | `/` |
| Customer | `/customer` |
| Professional / Technician | `/professional` |
| Organization / Construction | `/organization` |
| Suppliers | `/suppliers` |

### Phases 1–9
1. Foundation — Design system, i18n, auth pages  
2. Marketplace — Bookings, Hot Jobs, dashboards  
3. Trust — Verification, Reviews, Support, Knowledge Base  
4. Payments — Telebirr/Chapa UI, Quotes, Earnings & Payouts  
5. Maps — Leaflet/OSM, Track technician, Dispatch  
6. Construction — Projects, Foreman, Workforce, Timesheets  
7. Analytics — KPIs, trends, tech & project performance  
8. Suppliers & Property — Catalog, Orders, Rentals, Home Passport  
9. AI — Floating assistant + Smart Matching  

### Backend
- ASP.NET Core 8 Web API  
- JWT auth, EF Core, PostgreSQL  
- Controllers: Auth, Bookings, Services, Projects  
- Supabase-compatible SQL schema  

### Notable routes
- `/customer/smart-match` — AI matching  
- `/customer/home-passport` — Properties  
- `/customer/track` — Live tracking  
- `/suppliers/catalog` · `/suppliers/orders` · `/suppliers/rentals`  
- `/organization/analytics` · `/organization/projects` · `/organization/foreman`  
- `/professional/dispatch` · `/professional/hot-jobs`  

Floating **Aba Mela Assistant** appears on every page (bottom-right).

---

## Stack
React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router 7 · i18next · Leaflet  
ASP.NET Core 8 · EF Core · Npgsql · JWT · Swagger · BCrypt  

---

Built as a scalable multi-portal platform for Ethiopia's home services and construction ecosystem.
