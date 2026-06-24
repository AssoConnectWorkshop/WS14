create table ws14_prenoms_votes (
  id bigint generated always as identity primary key,
  prenom_id bigint references ws14_prenoms(id),
  vote text not null check (vote in ('like', 'skip')),
  created_at timestamptz default now()
);

alter table ws14_prenoms_votes enable row level security;
create policy "public insert" on ws14_prenoms_votes for insert to anon with check (true);
create policy "public select" on ws14_prenoms_votes for select to anon using (true);
