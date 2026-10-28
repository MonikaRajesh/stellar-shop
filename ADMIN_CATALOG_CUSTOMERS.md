# Admin Catalog & Customer Management

## Product management
The admin dashboard now supports:
- Manual product creation/editing with the full catalog fields used by the app.
- Bulk CSV import.
- Full CSV export.
- Downloadable CSV template.
- Product search, edit and delete.
- Persistence to Supabase when logged in as a Supabase admin; local fallback remains available for the local admin session.

CSV required fields:
`name, slug, brand, category`

The exported CSV is directly reusable for bulk edits/imports. JSON fields such as images, colors, specs, tags, reviews and frequently-bought-together are preserved.

## Customer management
The Customers tab shows registered profiles and, when orders are linked to their Supabase user ID:
- Name
- Email
- Mobile / username
- Address
- Registration date
- Number of orders
- Total amount spent
- Purchased product names
- Last order date
- Account role
- Last-login / last-seen data is retained in the profile data

Orders now retain the customer's `userId` in the client order model as well, so local order state and Supabase order records can be associated with the customer.

## Important for production
Customer/order reporting is protected by Supabase RLS. A real Supabase admin session is required to read all customers and orders. The local admin credential is intentionally only a fallback when Supabase is unavailable; it cannot bypass Supabase Row Level Security.

Create/register the intended admin account in Supabase Auth and set its `profiles.role` to `admin` using the SQL instructions already present in `supabase/schema.sql`.
