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
  image_url text,
  audio_url text,
  video_url text,
  used boolean not null default false
);

create table if not exists answer_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references questions(id) on delete cascade,
  text text not null,
  is_correct boolean not null default false
);
