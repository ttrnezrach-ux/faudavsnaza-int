-- One visit = one 30-minute window per IP from real page events.
-- Does not delete rows. Stops treating every SSR refresh as a new visit.
update unique_ips i
set visit_count = greatest(
  1,
  coalesce(
    (
      select count(*)::int
      from (
        select 1
        from behavior_events e
        where e.ip_hash = i.ip_hash and e.kind = 'page'
        group by floor(extract(epoch from e.created_at) / 1800)
      ) windows
    ),
    1
  )
);

update unique_visitors v
set visit_count = greatest(
  1,
  coalesce(
    (
      select count(*)::int
      from (
        select 1
        from behavior_events e
        where e.visitor_key = v.visitor_key and e.kind = 'page'
        group by floor(extract(epoch from e.created_at) / 1800)
      ) windows
    ),
    1
  )
);
