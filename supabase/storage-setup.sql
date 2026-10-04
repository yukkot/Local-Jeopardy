insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

-- Igual que con las tablas (ver TODO de RLS en schema.sql), esto deja el
-- bucket abierto para el cliente anonimo: suficiente para el uso cerrado
-- actual, pendiente de endurecer en el hito de seguridad.
create policy "media_public_read"
on storage.objects for select
to public
using (bucket_id = 'media');

create policy "media_anon_insert"
on storage.objects for insert
to public
with check (bucket_id = 'media');
