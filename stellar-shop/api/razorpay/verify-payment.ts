import crypto from 'node:crypto';

const json = (res: any, status: number, body: unknown) => {
  res.status(status).setHeader('Content-Type', 'application/json').json(body);
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) return json(res, 500, { error: 'Razorpay server credentials are not configured in Vercel.' });

  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, receipt, expected_amount } = req.body ?? {};
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !receipt || !expected_amount) {
      return json(res, 400, { verified: false, error: 'Incomplete payment verification data.' });
    }

    const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const orderResponse = await fetch(`https://api.razorpay.com/v1/orders/${encodeURIComponent(razorpay_order_id)}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const razorpayOrder = await orderResponse.json();
    if (!orderResponse.ok) return json(res, 400, { verified: false, error: 'Unable to verify Razorpay order.' });

    if (razorpayOrder.receipt !== receipt || Number(razorpayOrder.amount) !== Number(expected_amount)) {
      return json(res, 400, { verified: false, error: 'Payment amount or order receipt mismatch.' });
    }

    const expected = crypto
      .createHmac('sha256', keySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    const expectedBuffer = Buffer.from(expected, 'utf8');
    const receivedBuffer = Buffer.from(String(razorpay_signature), 'utf8');
    const valid = expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
    if (!valid) return json(res, 400, { verified: false, error: 'Payment signature verification failed.' });

    const paymentResponse = await fetch(`https://api.razorpay.com/v1/payments/${encodeURIComponent(razorpay_payment_id)}`, {
      headers: { Authorization: `Basic ${auth}` },
    });
    const payment = await paymentResponse.json();
    if (!paymentResponse.ok) return json(res, 400, { verified: false, error: 'Unable to verify payment status.' });

    if (payment.order_id !== razorpay_order_id || !['authorized', 'captured'].includes(payment.status)) {
      return json(res, 400, { verified: false, error: `Payment is not successful. Current status: ${payment.status || 'unknown'}.` });
    }

    return json(res, 200, {
      verified: true,
      status: payment.status,
      paymentId: razorpay_payment_id,
      orderId: razorpay_order_id,
      method: payment.method,
    });
  } catch (error) {
    return json(res, 500, { verified: false, error: error instanceof Error ? error.message : 'Payment verification failed.' });
  }
}
