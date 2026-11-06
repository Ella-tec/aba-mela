# Mela API (ASP.NET Core 8)

## Requirements
- .NET 8 SDK
- PostgreSQL

## Setup

```bash
cd backend/AbaMela.Api
dotnet restore
# update appsettings.json connection string
dotnet ef migrations add Initial --if you have EF tools
dotnet run
```

Swagger: http://localhost:5000/swagger (or the port shown)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth/register | No | Register (Customer/Professional/Organization) |
| POST | /api/auth/login | No | Login → JWT |
| GET | /api/services | No | Service categories |
| GET | /api/bookings | Yes | List bookings (role-scoped) |
| POST | /api/bookings | Yes | Create booking |
| POST | /api/bookings/{id}/accept | Yes | Professional accepts job |
| PATCH | /api/bookings/{id}/status | Yes | Update status |
| GET/POST | /api/projects | Yes | Construction projects |
| GET | /health | No | Health check |

## Alternative: Supabase

If you prefer Supabase instead of self-hosted PostgreSQL + API:

1. Create a Supabase project
2. Use the SQL in `supabase/schema.sql` (see sibling folder if added)
3. Point the React app at Supabase Auth + PostgREST
4. Keep the same domain models (Users, Bookings, Projects, Products)

## Frontend integration

In the React app, set:

```
VITE_API_URL=http://localhost:5000
```

and call `/api/auth/login` etc. with `Authorization: Bearer <token>`.
