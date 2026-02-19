-- AVGVerzoek NL — Supabase Schema
create extension if not exists "uuid-ossp";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users unique,
  naam text not null,
  kvk text,
  contactpersoon text,
  email text,
  plan text default 'gratis' check (plan in ('gratis', 'mkb', 'bureau')),
  created_at timestamptz default now()
);

create table if not exists verzoeken (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade,
  verzoek_nummer text unique,
  status text default 'nieuw' check (status in ('nieuw', 'in_behandeling', 'afgerond', 'verlopen')),
  betrokkene_naam text not null,
  betrokkene_email text,
  betrokkene_bsn_partial text,
  ontvangen_op timestamptz default now(),
  deadline timestamptz generated always as (ontvangen_op + interval '30 days') stored,
  systemen_gecontroleerd jsonb default '[]',
  notities text,
  antwoord_concept text,
  afgerond_op timestamptz,
  created_at timestamptz default now()
);

alter table companies enable row level security;
alter table verzoeken enable row level security;

create policy if not exists "Own companies" on companies for all using (user_id = auth.uid());
create policy if not exists "Own verzoeken" on verzoeken for all
  using (company_id in (select id from companies where user_id = auth.uid()));
