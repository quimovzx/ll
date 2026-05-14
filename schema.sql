create table if not exists device_logs (

    id bigint generated always as identity primary key,

    created_at timestamptz default now(),

    platform text,
    browser text,
    language text,

    ram text,
    cpu text,

    online boolean,

    timezone text,

    screen text,

    dark_mode boolean,

    battery text,
    charging boolean,

    network text,

    latitude text,
    longitude text,
    accuracy text

);

alter table device_logs enable row level security;

drop policy if exists "Allow inserts"
on device_logs;

drop policy if exists "Allow reads"
on device_logs;

create policy "Allow inserts"
on device_logs
for insert
to anon
with check (true);

create policy "Allow reads"
on device_logs
for select
to anon
using (true);