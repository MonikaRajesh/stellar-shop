# Product CSV / Home Catalog Fix

The product catalog now uses the same normalized product shape everywhere (CSV import, admin catalog, homepage, category pages, and product details).

## What was fixed
- `source.unsplash.com` image URLs are rejected because that endpoint is retired/unreliable.
- Products without a working image now use a stable category-specific Pexels image instead of the generic broken-image placeholder.
- CSV categories such as `Mobiles`, `Earbuds`, and `Speakers` are mapped to the application's canonical categories.
- Additional imported categories (`Televisions`, `Home Appliances`, `Networking`, `Storage`, `Fashion`) are available in the category menu and category routes.
- Existing products already stored in Supabase are normalized when loaded, so previously imported broken-image records display correctly without re-importing the CSV.
- Future CSV imports are normalized before being written to Supabase.
- Missing IDs in CSV imports are derived from the product slug, preventing duplicate products when the same CSV is imported again.

No Supabase SQL migration is required for this frontend fix.
