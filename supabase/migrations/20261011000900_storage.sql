-- =====================================================================
-- Fauteo — 0900 : stockage des fichiers
-- Convention : le premier dossier du chemin identifie le propriétaire
-- (utilisateur, conversation ou réservation) et sert aux règles d'accès.
-- Les documents d'identité, contrats et factures restent privés (URL
-- signées à durée limitée).
-- =====================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('documents',           'documents',           false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/heic', 'image/webp']),
  ('avatars',             'avatars',             true,   2097152, array['image/jpeg', 'image/png', 'image/webp']),
  ('listing-photos',      'listing-photos',      true,   8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('portfolio',           'portfolio',           true,   8388608, array['image/jpeg', 'image/png', 'image/webp']),
  ('message-attachments', 'message-attachments', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('dispute-evidence',    'dispute-evidence',    false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/heic']),
  ('contracts',           'contracts',           false,  5242880, array['application/pdf']),
  ('invoices',            'invoices',            false,  5242880, array['application/pdf'])
on conflict (id) do nothing;

create function public.is_booking_party(p_booking text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.bookings b
                 where b.id::text = p_booking and auth.uid() in (b.pro_id, b.host_id));
$$;

create function public.is_conversation_member_text(p_conversation text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.conversations c
                 where c.id::text = p_conversation and auth.uid() in (c.pro_id, c.host_id));
$$;

-- Dossiers personnels : documents, avatars, photos d'annonces, portfolio
create policy "storage: dépôt dans son dossier" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('documents', 'avatars', 'listing-photos', 'portfolio')
              and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "storage: remplacement dans son dossier" on storage.objects
  for update to authenticated
  using (bucket_id in ('avatars', 'listing-photos', 'portfolio')
         and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "storage: suppression dans son dossier" on storage.objects
  for delete to authenticated
  using (bucket_id in ('documents', 'avatars', 'listing-photos', 'portfolio')
         and (storage.foldername(name))[1] = (select auth.uid())::text);

create policy "storage: lecture de ses documents" on storage.objects
  for select to authenticated
  using (bucket_id = 'documents'
         and ((storage.foldername(name))[1] = (select auth.uid())::text or public.is_admin()));

-- Pièces jointes de messagerie : membres de la conversation
create policy "storage: pièces jointes (lecture)" on storage.objects
  for select to authenticated
  using (bucket_id = 'message-attachments' and public.is_conversation_member_text((storage.foldername(name))[1]));

create policy "storage: pièces jointes (dépôt)" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'message-attachments' and public.is_conversation_member_text((storage.foldername(name))[1]));

-- Preuves de litige : parties de la réservation
create policy "storage: preuves de litige (lecture)" on storage.objects
  for select to authenticated
  using (bucket_id = 'dispute-evidence'
         and (public.is_booking_party((storage.foldername(name))[1]) or public.is_admin()));

create policy "storage: preuves de litige (dépôt)" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'dispute-evidence' and public.is_booking_party((storage.foldername(name))[1]));

-- Contrats et factures : lecture par les parties, écriture par le serveur uniquement
create policy "storage: contrats et factures (lecture)" on storage.objects
  for select to authenticated
  using (bucket_id in ('contracts', 'invoices')
         and (public.is_booking_party((storage.foldername(name))[1]) or public.is_admin()));
