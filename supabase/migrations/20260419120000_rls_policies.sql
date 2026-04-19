-- Allow anon to insert, update, delete (admin auth is handled client-side)
create policy "Anon can insert props"
  on public.props for insert
  to anon
  with check (true);

create policy "Anon can update props"
  on public.props for update
  to anon
  using (true)
  with check (true);

create policy "Anon can delete props"
  on public.props for delete
  to anon
  using (true);

-- Allow anon to read all props (admin needs unpublished ones too)
drop policy if exists "Public can read published props" on public.props;

create policy "Anon can read all props"
  on public.props for select
  to anon
  using (true);
