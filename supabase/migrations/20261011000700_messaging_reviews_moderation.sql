-- =====================================================================
-- Fauteo — 0700 : messagerie, avis croisés, signalements, litiges, notifications
-- CDC : F-50 à F-53, B-03, B-04, §6 (Suspension)
-- =====================================================================

-- ---------------------------------------------------------------------
-- Messagerie (F-50) : une conversation par couple pro / hôte / poste
-- ---------------------------------------------------------------------
create table public.conversations (
  id              uuid primary key default gen_random_uuid(),
  pro_id          uuid not null references public.profiles (id) on delete cascade,
  host_id         uuid not null references public.profiles (id) on delete cascade,
  station_id      uuid not null references public.stations (id) on delete cascade,
  last_message_at timestamptz,
  created_at      timestamptz not null default now(),
  unique (pro_id, host_id, station_id),
  check (pro_id <> host_id)
);

create index conversations_pro_idx  on public.conversations (pro_id, last_message_at desc nulls last);
create index conversations_host_idx on public.conversations (host_id, last_message_at desc nulls last);

create table public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  body            text not null default '' check (char_length(body) <= 4000),
  attachments     text[] not null default '{}' check (cardinality(attachments) <= 6), -- bucket « message-attachments »
  read_at         timestamptz,
  created_at      timestamptz not null default now(),
  check (char_length(body) > 0 or cardinality(attachments) > 0)
);

create index messages_conversation_idx on public.messages (conversation_id, created_at desc);

create function public.is_conversation_member(conv uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.conversations c
                 where c.id = conv and auth.uid() in (c.pro_id, c.host_id));
$$;

-- Ouvre (ou retrouve) la conversation sur un poste.
-- Pro : avec l'hôte du poste. Hôte : avec un pro ayant déjà réservé ce poste.
create function public.open_conversation(p_station uuid, p_pro uuid default null)
returns public.conversations
language plpgsql
security definer
set search_path = ''
as $$
declare
  st   public.stations;
  pro  uuid;
  conv public.conversations;
begin
  if auth.uid() is null or public.is_suspended(auth.uid()) then
    raise exception 'Accès refusé.' using errcode = 'insufficient_privilege';
  end if;

  select * into st from public.stations where id = p_station;
  if st.id is null then
    raise exception 'Poste introuvable.' using errcode = 'no_data_found';
  end if;

  if auth.uid() = st.host_id then
    pro := p_pro;
    if pro is null or not exists (select 1 from public.bookings b where b.station_id = st.id and b.pro_id = pro) then
      raise exception 'Ce professionnel n''a pas de réservation sur ce poste.' using errcode = 'P0001';
    end if;
  else
    if st.status <> 'published' then
      raise exception 'Poste introuvable.' using errcode = 'no_data_found';
    end if;
    pro := auth.uid();
  end if;

  insert into public.conversations (pro_id, host_id, station_id)
  values (pro, st.host_id, st.id)
  on conflict (pro_id, host_id, station_id) do update set pro_id = excluded.pro_id
  returning * into conv;

  return conv;
end;
$$;

create function public.touch_conversation()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.conversations set last_message_at = new.created_at where id = new.conversation_id;
  return new;
end;
$$;

create trigger messages_touch_conversation
  after insert on public.messages
  for each row execute function public.touch_conversation();

revoke insert, update, delete on public.conversations from anon, authenticated;
revoke insert, update, delete on public.messages from anon, authenticated;
grant insert (conversation_id, sender_id, body, attachments), update (read_at) on public.messages to authenticated;

alter table public.conversations enable row level security;
alter table public.messages      enable row level security;

create policy "conversations: lecture par les membres" on public.conversations
  for select to authenticated
  using ((select auth.uid()) in (pro_id, host_id) or public.is_admin());

create policy "messages: lecture par les membres" on public.messages
  for select to authenticated
  using (public.is_conversation_member(conversation_id) or public.is_admin());
create policy "messages: envoi par un membre" on public.messages
  for insert to authenticated
  with check (sender_id = (select auth.uid())
              and public.is_conversation_member(conversation_id)
              and not public.is_suspended((select auth.uid())));
create policy "messages: accusé de lecture par le destinataire" on public.messages
  for update to authenticated
  using (sender_id <> (select auth.uid()) and public.is_conversation_member(conversation_id))
  with check (sender_id <> (select auth.uid()) and public.is_conversation_member(conversation_id));

-- Messages en temps réel (Supabase Realtime)
do $$
begin
  if exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;

-- ---------------------------------------------------------------------
-- Avis croisés (F-52) : double aveugle, publiés quand les deux parties
-- ont noté ou 14 jours après la fin de la réservation.
-- ---------------------------------------------------------------------
create table public.reviews (
  id           uuid primary key default gen_random_uuid(),
  booking_id   uuid not null references public.bookings (id) on delete cascade,
  author_id    uuid not null references public.profiles (id) on delete cascade,
  target_id    uuid not null references public.profiles (id) on delete cascade,
  station_id   uuid not null references public.stations (id) on delete cascade,
  author_role  public.review_role not null,
  rating       smallint not null check (rating between 1 and 5),
  comment      text check (char_length(comment) <= 2000),
  published_at timestamptz,
  hidden_at    timestamptz, -- masqué par la modération (B-03)
  created_at   timestamptz not null default now(),
  unique (booking_id, author_id)
);

create index reviews_target_idx  on public.reviews (target_id) where published_at is not null and hidden_at is null;
create index reviews_station_idx on public.reviews (station_id) where published_at is not null and hidden_at is null;

create function public.refresh_rating_aggregates(p_station uuid, p_pro uuid)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.stations s set
    rating_avg   = agg.avg, rating_count = agg.cnt
  from (select round(avg(rating), 2) as avg, count(*)::integer as cnt from public.reviews
        where station_id = p_station and author_role = 'pro' and published_at is not null and hidden_at is null) agg
  where s.id = p_station;

  update public.pro_profiles p set
    rating_avg   = agg.avg, rating_count = agg.cnt
  from (select round(avg(rating), 2) as avg, count(*)::integer as cnt from public.reviews
        where target_id = p_pro and author_role = 'host' and published_at is not null and hidden_at is null) agg
  where p.profile_id = p_pro;
$$;

create function public.reviews_after_change()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  pro uuid := case when new.author_role = 'pro' then new.author_id else new.target_id end;
begin
  perform public.refresh_rating_aggregates(new.station_id, pro);
  return null;
end;
$$;

create trigger reviews_aggregates
  after update of published_at, hidden_at on public.reviews
  for each row execute function public.reviews_after_change();

create function public.submit_review(p_booking uuid, p_rating smallint, p_comment text default null)
returns public.reviews
language plpgsql
security definer
set search_path = ''
as $$
declare
  cfg public.platform_settings;
  b   public.bookings;
  r   public.reviews;
begin
  select * into cfg from public.platform_settings;
  select * into b from public.bookings where id = p_booking and auth.uid() in (pro_id, host_id);
  if b.id is null then
    raise exception 'Réservation introuvable.' using errcode = 'no_data_found';
  end if;
  if b.status <> 'completed' then
    raise exception 'Vous pourrez laisser un avis après la prestation.' using errcode = 'P0001';
  end if;
  if now() > upper(b.period) + make_interval(days => cfg.review_window_days) then
    raise exception 'Le délai pour laisser un avis est dépassé.' using errcode = 'P0001';
  end if;

  insert into public.reviews (booking_id, author_id, target_id, station_id, author_role, rating, comment)
  values (b.id, auth.uid(),
          case when auth.uid() = b.pro_id then b.host_id else b.pro_id end,
          b.station_id,
          case when auth.uid() = b.pro_id then 'pro' else 'host' end::public.review_role,
          p_rating, nullif(trim(p_comment), ''))
  returning * into r;

  -- Second avis posté : les deux deviennent publics
  if (select count(*) from public.reviews where booking_id = b.id) = 2 then
    update public.reviews set published_at = now() where booking_id = b.id and published_at is null;
    select * into r from public.reviews where id = r.id;
  end if;

  return r;
exception
  when unique_violation then
    raise exception 'Vous avez déjà laissé un avis pour cette réservation.' using errcode = 'P0001';
end;
$$;

create function public.publish_due_reviews()
returns void
language sql
security definer
set search_path = ''
as $$
  update public.reviews r set published_at = now()
  from public.bookings b, public.platform_settings cfg
  where r.booking_id = b.id and r.published_at is null
    and upper(b.period) + make_interval(days => cfg.review_window_days) <= now();
$$;

revoke insert, update, delete on public.reviews from anon, authenticated;
alter table public.reviews enable row level security;

create policy "reviews: lecture" on public.reviews
  for select using (
    (published_at is not null and hidden_at is null)
    or author_id = (select auth.uid())
    or public.is_admin()
  );

-- ---------------------------------------------------------------------
-- Signalements (F-53) et suspension automatique (CDC §6)
-- ---------------------------------------------------------------------
create table public.reports (
  id                uuid primary key default gen_random_uuid(),
  reporter_id       uuid not null references public.profiles (id) on delete cascade,
  target_type       public.report_target not null,
  target_id         uuid not null,
  target_profile_id uuid references public.profiles (id) on delete cascade, -- propriétaire de la cible
  reason            public.report_reason not null,
  details           text check (char_length(details) <= 2000),
  status            public.report_status not null default 'open',
  resolution_note   text,
  handled_by        uuid references public.profiles (id) on delete set null,
  handled_at        timestamptz,
  created_at        timestamptz not null default now()
);

create index reports_open_idx   on public.reports (created_at) where status = 'open';
create index reports_target_idx on public.reports (target_profile_id, status);

create function public.report_set_target_profile()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  new.target_profile_id := case new.target_type
    when 'profile' then (select id        from public.profiles where id = new.target_id)
    when 'station' then (select host_id   from public.stations where id = new.target_id)
    when 'venue'   then (select host_id   from public.venues   where id = new.target_id)
    when 'message' then (select sender_id from public.messages where id = new.target_id)
    when 'review'  then (select author_id from public.reviews  where id = new.target_id)
  end;
  if new.target_profile_id is null then
    raise exception 'Élément signalé introuvable.' using errcode = 'no_data_found';
  end if;
  if new.target_profile_id = new.reporter_id then
    raise exception 'Vous ne pouvez pas vous signaler vous-même.' using errcode = 'P0001';
  end if;
  return new;
end;
$$;

create trigger reports_target_profile
  before insert on public.reports
  for each row execute function public.report_set_target_profile();

create function public.resolve_report(p_report uuid, p_upheld boolean, p_note text default null)
returns public.reports
language plpgsql
security definer
set search_path = ''
as $$
declare
  rep public.reports;
  threshold integer;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs.' using errcode = 'insufficient_privilege';
  end if;

  update public.reports
     set status = case when p_upheld then 'upheld' else 'dismissed' end::public.report_status,
         resolution_note = p_note, handled_by = auth.uid(), handled_at = now()
   where id = p_report and status = 'open'
  returning * into rep;
  if rep.id is null then
    raise exception 'Signalement introuvable ou déjà traité.' using errcode = 'P0001';
  end if;

  insert into public.audit_log (actor_id, action, entity, entity_id, data)
  values (auth.uid(), 'report.resolve', 'reports', rep.id, jsonb_build_object('upheld', p_upheld, 'note', p_note));

  -- Trois signalements fondés : suspension pour examen
  select suspension_report_threshold into threshold from public.platform_settings;
  if p_upheld and (select count(*) from public.reports
                   where target_profile_id = rep.target_profile_id and status = 'upheld') >= threshold then
    update public.profiles
       set suspended_at = coalesce(suspended_at, now()),
           suspension_reason = coalesce(suspension_reason, 'Signalements fondés répétés')
     where id = rep.target_profile_id;
    insert into public.audit_log (actor_id, action, entity, entity_id, data)
    values (auth.uid(), 'account.auto_suspend', 'profiles', rep.target_profile_id, '{}');
  end if;

  return rep;
end;
$$;

revoke insert, update, delete on public.reports from anon, authenticated;
grant insert (reporter_id, target_type, target_id, reason, details) on public.reports to authenticated;

alter table public.reports enable row level security;

create policy "reports: création" on public.reports
  for insert to authenticated with check (reporter_id = (select auth.uid()));
create policy "reports: lecture auteur ou admin" on public.reports
  for select to authenticated using (reporter_id = (select auth.uid()) or public.is_admin());

-- ---------------------------------------------------------------------
-- Litiges (B-04) : gèlent les versements à venir et la caution
-- ---------------------------------------------------------------------
create table public.disputes (
  id                    uuid primary key default gen_random_uuid(),
  booking_id            uuid not null references public.bookings (id) on delete restrict,
  opened_by             uuid not null references public.profiles (id) on delete restrict,
  description           text not null check (char_length(description) between 10 and 4000),
  attachments           text[] not null default '{}',
  status                public.dispute_status not null default 'open',
  refund_cents          integer not null default 0 check (refund_cents >= 0),
  deposit_capture_cents integer not null default 0 check (deposit_capture_cents >= 0),
  resolution_note       text,
  resolved_by           uuid references public.profiles (id) on delete set null,
  resolved_at           timestamptz,
  created_at            timestamptz not null default now()
);

create unique index disputes_one_open_per_booking on public.disputes (booking_id) where status = 'open';

create function public.open_dispute(p_booking uuid, p_description text, p_attachments text[] default '{}')
returns public.disputes
language plpgsql
security definer
set search_path = ''
as $$
declare
  cfg public.platform_settings;
  b   public.bookings;
  d   public.disputes;
begin
  select * into cfg from public.platform_settings;
  select * into b from public.bookings where id = p_booking and auth.uid() in (pro_id, host_id);
  if b.id is null then
    raise exception 'Réservation introuvable.' using errcode = 'no_data_found';
  end if;
  if b.status not in ('confirmed', 'in_progress', 'completed')
     or now() > upper(b.period) + make_interval(hours => cfg.deposit_release_hours) then
    raise exception 'Un litige ne peut plus être ouvert sur cette réservation.' using errcode = 'P0001';
  end if;

  insert into public.disputes (booking_id, opened_by, description, attachments)
  values (b.id, auth.uid(), p_description, coalesce(p_attachments, '{}'))
  returning * into d;

  update public.payouts set status = 'held' where booking_id = b.id and status = 'scheduled';

  return d;
exception
  when unique_violation then
    raise exception 'Un litige est déjà ouvert sur cette réservation.' using errcode = 'P0001';
end;
$$;

-- Résolution par l'admin. Les opérations Stripe (remboursement, capture
-- de la caution) sont exécutées ensuite par le serveur à partir des montants.
create function public.resolve_dispute(p_dispute uuid, p_status public.dispute_status, p_refund_cents integer,
                                       p_deposit_capture_cents integer, p_note text)
returns public.disputes
language plpgsql
security definer
set search_path = ''
as $$
declare
  d public.disputes;
  b public.bookings;
begin
  if not public.is_admin() then
    raise exception 'Réservé aux administrateurs.' using errcode = 'insufficient_privilege';
  end if;
  if p_status = 'open' then
    raise exception 'Statut de résolution invalide.' using errcode = 'check_violation';
  end if;

  select * into d from public.disputes where id = p_dispute and status = 'open' for update;
  if d.id is null then
    raise exception 'Litige introuvable ou déjà résolu.' using errcode = 'P0001';
  end if;
  select * into b from public.bookings where id = d.booking_id;

  if p_refund_cents > b.total_cents - b.refund_cents or p_deposit_capture_cents > b.deposit_cents then
    raise exception 'Montants supérieurs aux sommes engagées.' using errcode = 'check_violation';
  end if;

  update public.disputes
     set status = p_status, refund_cents = p_refund_cents, deposit_capture_cents = p_deposit_capture_cents,
         resolution_note = p_note, resolved_by = auth.uid(), resolved_at = now()
   where id = d.id
  returning * into d;

  -- Remboursement intégral : plus rien à verser à l'hôte ; sinon reprise du calendrier
  update public.payouts
     set status = case when p_status = 'resolved_refund' then 'cancelled' else 'scheduled' end::public.payout_status
   where booking_id = d.booking_id and status = 'held';

  insert into public.audit_log (actor_id, action, entity, entity_id, data)
  values (auth.uid(), 'dispute.resolve', 'disputes', d.id,
          jsonb_build_object('status', p_status, 'refund_cents', p_refund_cents,
                             'deposit_capture_cents', p_deposit_capture_cents, 'note', p_note));
  return d;
end;
$$;

revoke insert, update, delete on public.disputes from anon, authenticated;
alter table public.disputes enable row level security;

create policy "disputes: lecture par les parties" on public.disputes
  for select to authenticated
  using (exists (select 1 from public.bookings b where b.id = booking_id
                 and (b.pro_id = (select auth.uid()) or b.host_id = (select auth.uid())))
         or public.is_admin());

-- ---------------------------------------------------------------------
-- Notifications (F-51) : centre de notifications in-app + file d'envoi
-- (e-mail, SMS, push) traitée par le serveur.
-- ---------------------------------------------------------------------
create table public.notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  type          text not null,
  title         text not null,
  body          text,
  data          jsonb not null default '{}',
  read_at       timestamptz,
  email_sent_at timestamptz,
  sms_sent_at   timestamptz,
  push_sent_at  timestamptz,
  created_at    timestamptz not null default now()
);

create index notifications_user_idx on public.notifications (user_id, created_at desc);
create index notifications_unsent_idx on public.notifications (created_at) where email_sent_at is null;

create function public.notify(p_user uuid, p_type text, p_title text, p_body text, p_data jsonb default '{}')
returns void
language sql
security definer
set search_path = ''
as $$
  insert into public.notifications (user_id, type, title, body, data)
  values (p_user, p_type, p_title, p_body, p_data);
$$;

create function public.bookings_notify()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  data jsonb := jsonb_build_object('booking_id', new.id, 'reference', new.reference);
begin
  if tg_op = 'UPDATE' and new.status = old.status then
    return null;
  end if;

  case new.status
    when 'requested' then
      perform public.notify(new.host_id, 'booking.requested', 'Nouvelle demande de réservation',
        'Vous avez 24 h pour accepter ou refuser la demande ' || new.reference || '.', data);
    when 'confirmed' then
      perform public.notify(new.pro_id, 'booking.confirmed', 'Réservation confirmée',
        'Votre réservation ' || new.reference || ' est confirmée.', data);
      perform public.notify(new.host_id, 'booking.confirmed', 'Réservation confirmée',
        'La réservation ' || new.reference || ' est confirmée.', data);
    when 'declined' then
      perform public.notify(new.pro_id, 'booking.declined', 'Demande refusée',
        'L''hôte n''a pas accepté la demande ' || new.reference || '. Vous êtes intégralement remboursé.', data);
    when 'expired' then
      if old.status = 'requested' then
        perform public.notify(new.pro_id, 'booking.expired', 'Demande expirée',
          'L''hôte n''a pas répondu sous 24 h. Vous êtes intégralement remboursé.', data);
      end if;
    when 'cancelled' then
      perform public.notify(case when new.cancelled_by = 'pro' then new.host_id else new.pro_id end,
        'booking.cancelled', 'Réservation annulée',
        'La réservation ' || new.reference || ' a été annulée.', data);
    when 'completed' then
      perform public.notify(new.pro_id,  'review.invite', 'Comment s''est passée votre location ?',
        'Laissez un avis sur la réservation ' || new.reference || '.', data);
      perform public.notify(new.host_id, 'review.invite', 'Comment s''est passée la location ?',
        'Laissez un avis sur la réservation ' || new.reference || '.', data);
    else
      null;
  end case;
  return null;
end;
$$;

create trigger bookings_notifications
  after insert or update of status on public.bookings
  for each row execute function public.bookings_notify();

revoke insert, update, delete on public.notifications from anon, authenticated;
grant update (read_at) on public.notifications to authenticated;
alter table public.notifications enable row level security;

create policy "notifications: lecture par le destinataire" on public.notifications
  for select to authenticated using (user_id = (select auth.uid()));
create policy "notifications: marquer comme lue" on public.notifications
  for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- ---------------------------------------------------------------------
-- Droits d'exécution
-- ---------------------------------------------------------------------
revoke execute on function public.notify(uuid, text, text, text, jsonb)            from public, anon, authenticated;
revoke execute on function public.publish_due_reviews()                            from public, anon, authenticated;
revoke execute on function public.refresh_rating_aggregates(uuid, uuid)            from public, anon, authenticated;
revoke execute on function public.open_conversation(uuid, uuid)                    from public, anon;
revoke execute on function public.submit_review(uuid, smallint, text)              from public, anon;
revoke execute on function public.resolve_report(uuid, boolean, text)              from public, anon;
revoke execute on function public.open_dispute(uuid, text, text[])                 from public, anon;
revoke execute on function public.resolve_dispute(uuid, public.dispute_status, integer, integer, text) from public, anon;
grant  execute on function public.open_conversation(uuid, uuid)                    to authenticated;
grant  execute on function public.submit_review(uuid, smallint, text)              to authenticated;
grant  execute on function public.resolve_report(uuid, boolean, text)              to authenticated;
grant  execute on function public.open_dispute(uuid, text, text[])                 to authenticated;
grant  execute on function public.resolve_dispute(uuid, public.dispute_status, integer, integer, text) to authenticated;
