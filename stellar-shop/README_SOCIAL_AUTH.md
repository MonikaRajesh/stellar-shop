# StellarShop Social Authentication

OTP login and signup verification have been removed from the UI.

The login and signup pages now support:
- Google
- LinkedIn (OIDC)
- GitHub
- Microsoft (Azure)
- Email + password as a fallback

## Supabase setup

In Supabase Dashboard → Authentication → Providers, enable the providers you want and configure their OAuth credentials.

For Google, configure the Google OAuth client and use the Supabase callback URL shown in the provider settings.
For LinkedIn, enable **LinkedIn (OIDC)** and configure the LinkedIn Client ID/Secret.
For GitHub, enable GitHub and configure its OAuth app.
For Microsoft, enable Azure and configure the Microsoft identity platform app.

Set the Supabase Site URL / redirect allow-list to the deployed site, for example:

https://stellar-shop-five.vercel.app

The frontend uses `signInWithOAuth()` and redirects back to the production site. No OTP email or SMS is requested by the social login buttons.
