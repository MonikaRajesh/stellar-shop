# Vercel Deployment

This project is configured as a Vite React TypeScript SPA.

## Important
The contents of this folder must be the **root of the GitHub repository**.
Do not put this project inside another `project/` subfolder.

## Deploy
1. Push all files in this folder to GitHub.
2. In Vercel, import the GitHub repository.
3. Set Framework Preset to Vite (or leave it on automatic detection).
4. Keep Root Directory as `./`.
5. Deploy.

The project includes `vercel.json` with the Vite build/output settings and SPA rewrite.


## Supabase environment variables

In Vercel Project Settings -> Environment Variables add:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Then redeploy. Run `supabase/schema.sql` once in your Supabase SQL Editor before using cloud orders/admin.

Admin dashboard: `/admin`
