-- ============================================
-- Settings Table (single-row for business info)
-- ============================================
create table public.settings (
  id uuid default uuid_generate_v4() primary key,
  business_name text default '',
  owner_name text default '',
  phone text default '',
  email text default '',
  hourly_rate numeric(10, 2) default 150,
  notes text default '',
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

-- RLS
alter table public.settings enable row level security;

create policy "Authenticated users can manage settings"
  on public.settings for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Trigger for updated_at
create trigger set_settings_updated_at
  before update on public.settings
  for each row execute function public.handle_updated_at();

-- Insert default row
insert into public.settings (business_name, owner_name, hourly_rate) values ('', '', 150);
