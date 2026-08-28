-- Stellar Shop password signup now uses the server-side Supabase Admin API with
-- email_confirm=true. No confirmation/OTP email is required by the application.
--
-- Optional global setting (not required by the application anymore):
-- Dashboard -> Authentication -> Providers -> Email -> Confirm email = OFF
select 'Stellar Shop signup uses server-side confirmed users; no email verification is required.' as instruction;
