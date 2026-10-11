-- =====================================================================
-- Fauteo — 0300 : documents justificatifs, vérification, journal admin
-- CDC : F-05, B-02, §6 « Documents obligatoires », §7, §8 (journalisation)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Journal des actions sensibles (validation, suspension, litiges...)
-- ---------------------------------------------------------------------
create table public.audit_log (
  id         bigint generated always as identity primary key,
  actor_id   uuid references public.profiles (id) on delete set null,
  action     text not null,
  entity     text not null,
  entity_id  uuid,
  data       jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index audit_log_entity_idx on public.audit_log (entity, entity_id);

alter table public.audit_log enable row level security;
revoke insert, update, delete on public.audit_log from anon, authenticated;

create policy "audit_log: lecture admin" on public.audit_log
  for select to authenticated using (public.is_admin());

-- ---------------------------------------------------------------------
-- Documents
-- Fichiers stockés dans le bucket privé « documents », chemin
-- « <owner_id>/<fichier> ». Le statut n'est modifiable que par l'admin.
-- ---------------------------------------------------------------------
create table public.documents (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null references public.profiles (id) on delete cascade,
  type             public.document_type not null,
  storage_path     text not null,
  status           public.document_status not null default 'pending',
  expires_at       date,
  rejection_reason text,
  reviewed_by      uuid references public.profiles (id) on delete set null,
  reviewed_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  -- Les attestations d'assurance ont une durée de validité : la date est obligatoire
  constraint documents_expiry_required
    check (type not in ('rc_pro', 'premises_insurance') or expires_at is not null),
  constraint documents_path_owner
    check (storage_path like owner_id::text || '/%'),
  constraint documents_rejection_reason
    check (status <> 'rejected' or rejection_reason is not null)
);

create index documents_owner_type_idx on public.documents (owner_id, type, status);
create index documents_pending_idx on public.documents (created_at) where status = 'pending';

create trigger documents_updated_at
  before update on public.documents
  for each row execute function public.set_updated_at();

revoke insert, update, delete on public.documents from anon, authenticated;
grant insert (owner_id, type, storage_path, expires_at), delete on public.documents to authenticated;

alter table public.documents enable row level security;

create policy "documents: lecture propriétaire ou admin" on public.documents
  for select to authenticated using (owner_id = (select auth.uid()) or public.is_admin());
create policy "documents: dépôt par le propriétaire" on public.documents
  for insert to authenticated with check (owner_id = (select auth.uid()));
create policy "documents: retrait d'un document en attente" on public.documents
  for delete to authenticated using (owner_id = (select auth.uid()) and status = 'pending');

-- ---------------------------------------------------------------------
-- Règles de vérification
-- Pro   : identité, SIRET, RC pro ; tatouage : + formation hygiène et
--         déclaration ARS.
-- Hôte  : identité, SIRET, assurance du local.
-- Un document approuvé mais expiré ne compte plus : le badge
-- « Vérifié » disparaît automatiquement à l'expiration.
-- ---------------------------------------------------------------------
create function public.required_documents(uid uuid, role public.app_role)
returns public.document_type[]
language sql
stable
security definer
set search_path = ''
as $$
  select case role
    when 'host' then array['identity', 'siret', 'premises_insurance']::public.document_type[]
    else array['identity', 'siret', 'rc_pro']::public.document_type[]
      || case when exists (
                 select 1 from public.pro_profiles pp
                 where pp.profile_id = uid and 'tatouage' = any (pp.trades))
              then array['hygiene_training', 'ars_declaration']::public.document_type[]
              else '{}'::public.document_type[] end
  end;
$$;

create function public.valid_document_types(uid uuid)
returns public.document_type[]
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(array_agg(distinct d.type), '{}')
  from public.documents d
  where d.owner_id = uid
    and d.status = 'approved'
    and (d.expires_at is null or d.expires_at >= current_date);
$$;

-- Liste des documents manquants : réservée à l'intéressé et à l'admin
create function public.missing_documents(uid uuid, role public.app_role)
returns public.document_type[]
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  result public.document_type[];
begin
  if uid <> auth.uid() and not public.is_admin() and auth.role() <> 'service_role' then
    raise exception 'Accès refusé.' using errcode = 'insufficient_privilege';
  end if;

  select coalesce(array_agg(t), '{}') into result
  from unnest(public.required_documents(uid, role)) as t
  where t <> all (public.valid_document_types(uid));

  return result;
end;
$$;

-- Badge « Vérifié » : information publique
create function public.is_verified(uid uuid, role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select
    case role
      when 'pro'  then exists (select 1 from public.pro_profiles  where profile_id = uid)
      when 'host' then exists (select 1 from public.host_profiles where profile_id = uid)
    end
    and public.required_documents(uid, role) <@ public.valid_document_types(uid);
$$;

-- ---------------------------------------------------------------------
-- Validation par l'admin (B-02), journalisée
-- ---------------------------------------------------------------------
create function public.review_document(document_id uuid, approve boolean, reason text default null)
returns public.documents
language plpgsql
security definer
set search_path = ''
as $$
declare
  doc public.documents;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs.' using errcode = 'insufficient_privilege';
  end if;

  update public.documents
     set status           = case when approve then 'approved' else 'rejected' end::public.document_status,
         rejection_reason = case when approve then null else reason end,
         reviewed_by      = auth.uid(),
         reviewed_at      = now()
   where id = document_id
  returning * into doc;

  if doc.id is null then
    raise exception 'Document introuvable.' using errcode = 'no_data_found';
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, data)
  values (auth.uid(), case when approve then 'document.approve' else 'document.reject' end,
          'documents', document_id, jsonb_build_object('type', doc.type, 'owner_id', doc.owner_id, 'reason', reason));

  return doc;
end;
$$;

-- ---------------------------------------------------------------------
-- Suspension / réactivation d'un compte par l'admin (B-02)
-- ---------------------------------------------------------------------
create function public.set_account_suspension(target uuid, suspend boolean, reason text default null)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs.' using errcode = 'insufficient_privilege';
  end if;

  update public.profiles
     set suspended_at      = case when suspend then now() end,
         suspension_reason = case when suspend then reason end
   where id = target;

  insert into public.audit_log (actor_id, action, entity, entity_id, data)
  values (auth.uid(), case when suspend then 'account.suspend' else 'account.reinstate' end,
          'profiles', target, jsonb_build_object('reason', reason));
end;
$$;

revoke execute on function public.review_document(uuid, boolean, text)        from public, anon;
revoke execute on function public.set_account_suspension(uuid, boolean, text) from public, anon;
revoke execute on function public.missing_documents(uuid, public.app_role)    from public, anon;
grant  execute on function public.review_document(uuid, boolean, text)        to authenticated;
grant  execute on function public.set_account_suspension(uuid, boolean, text) to authenticated;
grant  execute on function public.missing_documents(uuid, public.app_role)    to authenticated;

-- Détail des documents d'un tiers : usage interne uniquement (is_verified reste public)
revoke execute on function public.valid_document_types(uuid)                  from public, anon, authenticated;
revoke execute on function public.required_documents(uuid, public.app_role)  from public, anon, authenticated;
