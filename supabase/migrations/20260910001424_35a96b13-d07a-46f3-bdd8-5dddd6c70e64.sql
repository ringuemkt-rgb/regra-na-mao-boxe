-- Papéis de acesso
create type public.app_role as enum ('admin', 'editor', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "users read own roles"
on public.user_roles for select to authenticated
using (user_id = auth.uid());

create policy "admins manage roles"
on public.user_roles for all to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

-- Escrita editorial restrita a administradores
grant select, insert, update, delete on public.posts to authenticated;
grant all on public.posts to service_role;
grant select, insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
grant select, insert, update, delete on public.authors to authenticated;
grant all on public.authors to service_role;

create policy "admins read all posts"
on public.posts for select to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "admins write posts"
on public.posts for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update posts"
on public.posts for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete posts"
on public.posts for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "admins write categories"
on public.categories for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update categories"
on public.categories for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete categories"
on public.categories for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "admins write authors"
on public.authors for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins update authors"
on public.authors for update to authenticated
using (public.has_role(auth.uid(), 'admin'))
with check (public.has_role(auth.uid(), 'admin'));

create policy "admins delete authors"
on public.authors for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));