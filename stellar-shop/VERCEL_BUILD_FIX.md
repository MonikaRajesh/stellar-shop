# Vercel build fix

Fixed `src/utils/whatsapp.ts` so it no longer references the `Product` type. The helper now uses a small local `WhatsAppProduct` shape (`name` and `price`), eliminating the TS2304 `Cannot find name 'Product'` failure seen on Vercel.

Build command remains:

`npm run build`
