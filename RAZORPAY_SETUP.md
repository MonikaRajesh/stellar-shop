# StellarShop Razorpay setup

This project uses Razorpay Standard Checkout with server-side order creation and server-side HMAC-SHA256 signature verification.

## Vercel environment variables

Add these in **Vercel → Settings → Environment Variables** for Preview and Production:

```text
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Do not commit the Key Secret to GitHub and do not prefix it with `VITE_`.

## Test mode

Use your Razorpay Test Mode keys first. Razorpay Checkout then provides test UPI, card, netbanking and wallet flows.

## Payment flow

1. Browser sends cart product IDs and quantities to `/api/razorpay/create-order`.
2. Server calculates subtotal, shipping, GST and the supported coupon discount from the server-side price table.
3. Server creates the Razorpay Order.
4. Browser opens Razorpay Standard Checkout.
5. Razorpay returns payment ID, order ID and signature.
6. Server retrieves the Razorpay order/payment, checks receipt + amount, verifies the HMAC-SHA256 signature and payment status.
7. Only then does the frontend create the StellarShop order record.

## Production

Before accepting real money, complete Razorpay KYC/Live activation, enable the payment methods you need, configure automatic capture, and add Razorpay webhooks for reliable fulfilment if the customer closes the browser after payment.
