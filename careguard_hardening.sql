-- CareGuard TN — durcissement Supabase (à relire et tester sur une copie avant la production)
-- Les noms de colonnes sont déduits du code client : adaptez-les à votre schéma réel.

-- 0) Vérifier que RLS est activé partout
alter table public.profiles               enable row level security;
alter table public.nurse_profiles         enable row level security;
alter table public.senior_blocked_nurses  enable row level security;
alter table public.banned_nurses          enable row level security;
alter table public.nurse_reviews          enable row level security;

-- 1) profiles : l'utilisateur ne peut PAS modifier son plan lui-même
revoke update on public.profiles from authenticated;
grant  update (display_name) on public.profiles to authenticated;   -- ajoutez les colonnes réellement éditables
-- (plan et plan_expires_at ne se modifient plus que via service_role / webhook Stripe)

drop policy if exists profiles_select_own on public.profiles;
create policy profiles_select_own on public.profiles
  for select to authenticated using (id = auth.uid());

drop policy if exists profiles_insert_own on public.profiles;
create policy profiles_insert_own on public.profiles
  for insert to authenticated with check (id = auth.uid());
-- Important : l'upsert du client envoie id + display_name seulement ; le plan par défaut doit être 'free'
alter table public.profiles alter column plan set default 'free';

-- 2) nurse_profiles : l'infirmier ne peut pas se vérifier lui-même
create or replace function public.force_nurse_pending()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if auth.role() <> 'service_role' then
    if tg_op = 'INSERT' then
      new.verification_status := 'pending';
    elsif new.verification_status is distinct from old.verification_status then
      new.verification_status := old.verification_status;
    end if;
  end if;
  return new;
end $$;

drop trigger if exists trg_force_nurse_pending on public.nurse_profiles;
create trigger trg_force_nurse_pending
  before insert or update on public.nurse_profiles
  for each row execute function public.force_nurse_pending();

drop policy if exists nurse_profiles_own on public.nurse_profiles;
create policy nurse_profiles_own on public.nurse_profiles
  for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 3) Blocage par les patients
drop policy if exists blocked_insert_own on public.senior_blocked_nurses;
create policy blocked_insert_own on public.senior_blocked_nurses
  for insert to authenticated with check (senior_user_id = auth.uid());

drop policy if exists blocked_select_own on public.senior_blocked_nurses;
create policy blocked_select_own on public.senior_blocked_nurses
  for select to authenticated
  using (senior_user_id = auth.uid() or nurse_user_id = auth.uid());

-- Un seul blocage par couple (nécessaire pour le upsert onConflict du client)
create unique index if not exists senior_blocked_nurses_pair_uq
  on public.senior_blocked_nurses (senior_user_id, nurse_user_id);

-- 4) Suspension automatique : 3 patients différents => 7 jours
alter table public.nurse_profiles add column if not exists suspended_until timestamptz;

create or replace function public.auto_suspend_nurse()
returns trigger language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(distinct senior_user_id) into n
  from public.senior_blocked_nurses where nurse_user_id = new.nurse_user_id;

  if n >= 3 then
    update public.nurse_profiles
       set suspended_until = now() + interval '7 days',
           is_available_now = false
     where user_id = new.nurse_user_id
       and (suspended_until is null or suspended_until < now());
  end if;
  return new;
end $$;

drop trigger if exists trg_auto_suspend_nurse on public.senior_blocked_nurses;
create trigger trg_auto_suspend_nurse
  after insert on public.senior_blocked_nurses
  for each row execute function public.auto_suspend_nurse();

-- 5) Un infirmier suspendu ne peut ni accepter ni recevoir de demandes
create or replace function public.nurse_is_active(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.nurse_profiles np
    where np.user_id = uid
      and (np.suspended_until is null or np.suspended_until < now())
      and not exists (select 1 from public.banned_nurses b where b.user_id = uid)
  );
$$;
-- Utilisez nurse_is_active(auth.uid()) dans vos politiques RLS sur nurse_visit_requests
-- et dans la fonction accept_open_visit_request (raise exception si faux).

-- 6) banned_nurses : lecture seule pour le client, écriture réservée au service_role
--    (le client ne lit que ses propres lignes ; pour vérifier un numéro avant inscription,
--     préférez une fonction RPC qui renvoie seulement un booléen)
create or replace function public.is_phone_banned(p text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.banned_nurses where phone = p);
$$;
revoke all on public.banned_nurses from anon, authenticated;
grant execute on function public.is_phone_banned(text) to authenticated;
-- Note : si vous appliquez ceci, remplacez dans index.html la requête .from('banned_nurses')
-- par client.rpc('is_phone_banned', { p: normPhone }) et vérifiez user_id via nurse_is_active.

-- 7) Stockage audio : bucket privé + accès limité au dossier de l'utilisateur
update storage.buckets set public = false where id in ('careguard-audio', 'nurse-docs');

drop policy if exists audio_own_folder on storage.objects;
create policy audio_own_folder on storage.objects
  for all to authenticated
  using      (bucket_id in ('careguard-audio','nurse-docs') and (storage.foldername(name))[2] = auth.uid()::text)
  with check (bucket_id in ('careguard-audio','nurse-docs') and (storage.foldername(name))[2] = auth.uid()::text);
-- Le code téléverse vers  <dossier>/<user_id>/<timestamp>.<ext>  => l'identifiant est le 2e segment.
-- Les membres de la famille/infirmier liés doivent lire via URL signée générée côté serveur
-- ou via une politique SELECT supplémentaire basée sur senior_care_links.
