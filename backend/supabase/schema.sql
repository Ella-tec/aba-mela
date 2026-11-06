-- Aba Mela — Supabase / PostgreSQL schema (alternative to ASP.NET EF)
create extension if not exists "pgcrypto";

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  phone text,
  full_name text not null,
  role text not null default 'Customer',
  preferred_language text not null default 'en',
  is_verified boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  key text unique not null,
  is_active boolean not null default true
);

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references users(id),
  professional_id uuid references users(id),
  service_category_id uuid references service_categories(id),
  status text not null default 'requested',
  address text not null,
  lat double precision,
  lng double precision,
  scheduled_at timestamptz,
  notes text,
  price numeric(12,2),
  created_at timestamptz not null default now()
);

create table if not exists quotes (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid references bookings(id),
  professional_id uuid references users(id),
  amount numeric(12,2) not null,
  notes text,
  status text not null default 'pending',
  valid_until timestamptz not null
);

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid references users(id),
  name text not null,
  client text,
  location text,
  status text not null default 'planning',
  progress int not null default 0,
  budget numeric(14,2) not null default 0,
  spent numeric(14,2) not null default 0,
  start_date date,
  end_date date
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid references users(id),
  name text not null,
  category text,
  stock int not null default 0,
  price numeric(12,2) not null,
  unit text not null default 'unit'
);

create index on bookings (status);
create index on bookings (customer_id);
create index on projects (organization_id);
