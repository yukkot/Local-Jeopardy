create extension if not exists "pgcrypto";

create table if not exists boards (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  board_id uuid not null references boards(id) on delete cascade,
  name text not null,
  image_url text,
  position int not null
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  value int not null,
  prompt text not null,
  correct_answer text,
  media_url text, -- imagen, audio o video (uno solo)
  used boolean not null default false
);
