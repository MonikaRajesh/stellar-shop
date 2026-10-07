# Social authentication

The production build enables Google by default via `VITE_SOCIAL_PROVIDERS=google`. This prevents disabled Supabase providers from opening a raw `Unsupported provider: provider is not enabled` response.

After enabling another provider in Supabase Authentication > Providers and configuring its OAuth credentials, set for example:
`VITE_SOCIAL_PROVIDERS=google,github,linkedin_oidc,azure`

The redirect URL is `https://stellar-shop-five.vercel.app/`.
