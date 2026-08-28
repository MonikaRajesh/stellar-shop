
const prices: Record<string, number> = {
  p1: 74999, p2: 52999, p3: 18999, p4: 112999, p5: 134999, p6: 68999,
  p7: 54999, p8: 22999, p9: 28999, p10: 8999, p11: 34999, p12: 12999,
  p13: 18999, p14: 3999, p15: 8999, p16: 84999, p17: 24999, p18: 49999,
  p19: 38999, p20: 32999, p21: 7999, p22: 5999, p23: 3499, p24: 2999,
  p25: 4999, p26: 1999,
};

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader('Content-Type', 'application/json').json(body);
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return json(res, 500, { error: 'Razorpay server credentials are not configured in Vercel.' });

  try {
    const { items, couponCode, receipt, customer } = req.body ?? {};
    if (!Array.isArray(items) || items.length === 0) return json(res, 400, { error: 'Cart is empty.' });
    if (!receipt || typeof receipt !== 'string' || receipt.length > 40) return json(res, 400, { error: 'Invalid order receipt.' });

    let subtotal = 0;
    for (const item of items) {
      const price = prices[String(item?.productId)];
      const quantity = Number(item?.quantity);
      if (!price || !Number.isInteger(quantity) || quantity < 1 || quantity > 20) {
        return json(res, 400, { error: 'Invalid cart item.' });
      }
      subtotal += price * quantity;
    }

    let discount = 0;
    const code = String(couponCode || '').trim().toUpperCase();
    if (code === 'STELLAR500' && subtotal >= 2999) discount = Math.min(500, subtotal);
    else if (code && code !== 'STELLAR500') return json(res, 400, { error: 'Invalid or expired coupon.' });

    const shipping = subtotal > 499 ? 0 : 49;
    const taxable = Math.max(0, subtotal - discount + shipping);
    const gst = Math.round(taxable * 0.18);
    const total = Math.max(0, subtotal - discount + shipping + gst);
    const amount = total * 100;

    if (!Number.isInteger(amount) || amount < 100) return json(res, 400, { error: 'Invalid payment amount.' });

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const razorpayResponse = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${auth}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'INR',
        receipt,
        notes: {
          source: 'stellar-shop-web',
          customer_email: String(customer?.email || '').slice(0, 200),
          customer_id: String(customer?.id || '').slice(0, 200),
        },
      }),
    });

    const data = await razorpayResponse.json();
    if (!razorpayResponse.ok) return json(res, razorpayResponse.status, { error: data?.error?.description || 'Razorpay order creation failed.' });

    return json(res, 200, {
      keyId,
      orderId: data.id,
      amount: data.amount,
      currency: data.currency,
      receipt,
      total,
      discount,
      shipping,
      gst,
    });
  } catch (error) {
    return json(res, 500, { error: error instanceof Error ? error.message : 'Unable to create Razorpay order.' });
  }
}
