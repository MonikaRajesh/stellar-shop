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
