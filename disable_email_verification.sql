-- Supabase Auth setting (not a SQL setting):
-- Dashboard -> Authentication -> Providers -> Email -> Confirm email = OFF
-- This is required for first-time email/password signup to create a session immediately.
-- The frontend cannot safely change a hosted Supabase Auth provider setting.
select 'Disable Confirm email in Supabase Dashboard: Authentication -> Providers -> Email -> Confirm email OFF' as instruction;
