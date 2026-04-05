-- ============================================================
-- Attendance Manager — Supabase SQL Schema
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Users table (optional, for multi-user support)
create table if not exists users (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  created_at timestamptz not null default now()
);

-- Workers table
create table if not exists workers (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid references users(id) on delete set null,
  name                    text not null,
  daily_wage              numeric,
  monthly_salary          numeric,
  overtime_rate_per_hour  numeric not null default 0,
  created_at              timestamptz not null default now(),
  constraint workers_has_wage check (
    daily_wage is not null or monthly_salary is not null
  )
);

-- Attendance table
create type attendance_status as enum ('present', 'absent');

create table if not exists attendance (
  id             uuid primary key default gen_random_uuid(),
  worker_id      uuid not null references workers(id) on delete cascade,
  date           date not null,
  status         attendance_status not null,
  overtime_hours numeric not null default 0,
  created_at     timestamptz not null default now(),
  constraint attendance_unique_per_day unique (worker_id, date)
);

-- Indexes
create index if not exists attendance_worker_date_idx on attendance(worker_id, date);
