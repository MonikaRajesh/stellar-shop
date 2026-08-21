# StellarShop final authentication fix

## Fixed
- Signup verification redirects to the production Vercel URL instead of localhost.
- Verification page accepts Supabase confirmation-link callbacks and 6-digit OTPs.
- Resend OTP has a 60-second client cooldown.
- Signup profile trigger correctly writes `username`.

## Required one-time Supabase setup
Run `supabase/fix_auth_trigger.sql` in Supabase SQL Editor for an existing project.

In Supabase Authentication -> URL Configuration:
- Site URL: `https://stellar-shop-five.vercel.app`
- Redirect URL: `https://stellar-shop-five.vercel.app/verify-email`

In the Confirm signup email template, do not hard-code localhost. Use Supabase's `{{ .ConfirmationURL }}`.

The built-in Supabase mailer still has server-side sending limits. Custom SMTP is required for higher-volume production email.
