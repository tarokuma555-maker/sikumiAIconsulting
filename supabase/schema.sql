-- 無料相談の申込を保存するテーブル
create table if not exists public.consultation_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  job text,
  message text,
  created_at timestamptz not null default now()
);

-- RLS有効化(APIはservice_role keyで書き込むため、公開ポリシーは作らない)
alter table public.consultation_requests enable row level security;
