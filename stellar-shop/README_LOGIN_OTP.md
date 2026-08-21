# StellarShop – Customer OTP Login

## What changed

- Customer signup creates the Supabase account immediately.
- Customer login no longer asks for a password.
- Login supports a 6-digit OTP by email.
- Login also supports phone/SMS OTP when a Supabase SMS provider is configured.
- OTP resend has a 60-second client-side cooldown.
- `shouldCreateUser: false` is used for login OTP so an unknown identifier does not silently create a new customer account.
- Orders page buttons now work:
  - View details → order details modal
  - Track order → live status/tracking modal
  - Return / Refund → records the request as Returned and updates Supabase
  - WhatsApp support remains available

## Supabase setup

### Email OTP
1. Supabase Dashboard → Authentication → Providers → Email: enable Email.
2. For OTP email delivery, edit the email OTP template so it includes `{{ .Token }}`.
3. If you want signup to create an account without signup-email verification, keep Confirm email disabled.
4. Do not repeatedly request OTPs. Supabase applies server-side rate limits.

### Phone OTP
Phone OTP requires an SMS provider configured in Supabase, such as Twilio, Vonage, MessageBird, or another supported provider. The frontend cannot send real SMS by itself.

Use international phone format, for example:
`+919876543210`

## Vercel

Set these environment variables if desired:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY` (or `VITE_SUPABASE_ANON_KEY`)
- `VITE_SITE_URL=https://stellar-shop-five.vercel.app`

The project also contains a public-client fallback for the Supabase URL/key supplied for this project. Never add a Supabase `service_role` or `sb_secret_` key to the frontend.


## Production login behavior
- Signup creates the account with email/password. Email confirmation should be OFF in Supabase so signup does not require email verification.
- Sign in uses a 6-digit OTP for an existing account via email or phone. `shouldCreateUser: false` prevents unknown identifiers from silently creating accounts.
- Email OTP requires the Supabase Magic Link/OTP email template to include `{{ .Token }}`.
- Phone OTP requires a configured SMS provider in Supabase (Twilio, Vonage, MessageBird, etc.). Supabase documents a default 60-second OTP request interval.
- Order View Details and Track Order open functional modals. Return/Refund updates the order to Returned and persists it when RLS permits it.
- Delivery address can be edited while an order is Processing; shipped/delivered orders are intentionally locked to avoid changing a parcel already in fulfillment.
