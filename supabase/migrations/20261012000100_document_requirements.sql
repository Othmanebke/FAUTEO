-- =====================================================================
-- Fauteo — 1100 : état des documents de l'utilisateur connecté
-- Alimente l'onboarding et l'espace « Mes documents » (F-05).
-- Statut : missing | pending | approved | rejected | expired
-- =====================================================================

create function public.my_document_requirements()
returns table (
  type             public.document_type,
  roles            public.app_role[],
  status           text,
  document_id      uuid,
  expires_at       date,
  rejection_reason text,
  submitted_at     timestamptz
)
language sql
stable
security definer
set search_path = ''
as $$
  with my_roles as (
    select 'pro'::public.app_role as role from public.pro_profiles where profile_id = auth.uid()
    union all
    select 'host'::public.app_role from public.host_profiles where profile_id = auth.uid()
  ),
  required as (
    select t as type, array_agg(r.role order by r.role) as roles
    from my_roles r, unnest(public.required_documents(auth.uid(), r.role)) as t
    group by t
  ),
  latest as (
    select distinct on (d.type) d.*
    from public.documents d
    where d.owner_id = auth.uid()
    order by d.type, d.created_at desc
  )
  select
    q.type,
    q.roles,
    case
      when l.id is null then 'missing'
      when l.status = 'approved' and l.expires_at < current_date then 'expired'
      else l.status::text
    end,
    l.id,
    l.expires_at,
    l.rejection_reason,
    l.created_at
  from required q
  left join latest l on l.type = q.type
  order by q.type;
$$;

revoke execute on function public.my_document_requirements() from public, anon;
grant  execute on function public.my_document_requirements() to authenticated;
