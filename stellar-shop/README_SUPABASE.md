# Stellar Shop — Supabase + Admin Setup

## 1. Supabase
1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. Register an account from the app.
4. In Supabase SQL Editor, promote that account:
   `update public.profiles set role = 'admin' where email = 'your-admin-email@example.com';`

## 2. Local/Vercel environment variables
Copy `.env.example` to `.env.local` for local development.

Set these in Vercel Project Settings → Environment Variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_ADMIN_EMAILS` (fallback)
- `VITE_WHATSAPP_NUMBER`

Never put a Supabase `service_role` key in this Vite application.

## 3. Features included
- Supabase-backed order creation.
- Customer order cancellation for Processing/Shipped orders.
- Cancellation reason and timestamp.
- Admin order dashboard.
- Admin order status changes.
- Admin order/revenue/active/cancelled metrics.
- Supabase Auth login/register when Supabase variables are configured.
- WhatsApp ordering from the cart.
- WhatsApp support shortcut from order history.
- LocalStorage fallback when Supabase is not configured.

## 4. WhatsApp
The WhatsApp button opens a pre-filled order message. It does not automatically send the order; the customer still presses Send in WhatsApp. Set `VITE_WHATSAPP_NUMBER` to the business number.

## 5. Deployment
Run:
`npm install`
`npm run build`

Then deploy the project root to Vercel and add the environment variables above.


## Production authentication setup

1. Run `supabase/schema.sql` in the Supabase SQL Editor.
2. In Supabase Auth settings, enable **Confirm email**.
3. Edit the **Confirm signup** email template so it displays `{{ .Token }}` as the 6-digit OTP. The app's `/verify-email` page verifies it with `supabase.auth.verifyOtp`.
4. Set the Supabase Site URL to your production domain and add the production `/verify-email` redirect URL.
5. Configure a custom SMTP provider before launch. Supabase's built-in email sender is rate-limited and is not suitable for a growing commercial store.
6. For bot protection, create a Cloudflare Turnstile site, set `VITE_TURNSTILE_SITE_KEY`, and enable CAPTCHA protection in Supabase Auth with the Turnstile secret key. The same challenge is shown on signup and login.
7. Never put a Supabase service-role key or Turnstile secret key in the Vite frontend. Only the Supabase publishable/anon key belongs in `VITE_SUPABASE_ANON_KEY`.
8. Run `npm run build` before deployment.

## Business growth features to add next

- Abandoned-cart recovery emails/WhatsApp with consent.
- Product reviews with verified-purchase badges and photo/video reviews.
- Referral program with unique referral codes and rewards.
- Personalized recommendations based on viewed/cart/purchase events.
- Coupon engine with expiry, minimum cart value, usage limits and first-order rules.
- Wishlist price-drop and back-in-stock alerts.
- SEO: product structured data, canonical URLs, sitemap, robots.txt, Open Graph/Twitter cards.
- Analytics: GA4/Meta Pixel plus server-side purchase/conversion events where appropriate.
- CRM segmentation: new users, repeat buyers, high-value customers, inactive customers.
- Delivery ETA, order tracking, cancellation/refund automation and transactional notifications.
- Customer support: WhatsApp click-to-chat, FAQ/search, and ticket history.
- Admin marketing dashboard: revenue, conversion rate, CAC, AOV, repeat purchase rate, cart abandonment and campaign ROI.
