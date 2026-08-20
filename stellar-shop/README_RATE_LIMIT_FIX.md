# StellarShop email rate-limit fix

The verification page prevents repeated resend requests with a 60-second client-side cooldown and shows a clear message when Supabase returns an email rate-limit error.

Important: Supabase's built-in email provider has a server-side sending limit. Frontend code cannot bypass that limit. For production, configure custom SMTP in Supabase Authentication > Emails > SMTP Settings.

No SMTP secret is stored in this project.
