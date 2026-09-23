create table if not exists office_lock (
  id int primary key,
  secret_b32 text not null,
  password_hash text,
  confirmed_at timestamptz,
  last_counter bigint,
  fail_count int not null default 0,
  locked_until timestamptz
);
