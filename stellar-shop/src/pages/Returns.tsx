import { Link } from 'react-router-dom';
import { RotateCcw, Clock, Shield, Truck, Headphones, Check } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const steps = [
  { title: 'Request a return', text: 'Go to My Orders, select the item, and click Return / Refund within 10 days of delivery.' },
  { title: 'Pickup scheduled', text: 'We arrange a free pickup at your address within 2-3 business days.' },
  { title: 'Quality check', text: 'Once received, the product is inspected to confirm it meets return conditions.' },
  { title: 'Refund issued', text: 'Refunds are processed to the original payment method within 5-7 business days.' },
];

const timeline = [
  { day: 'Day 0', text: 'Return request submitted' },
  { day: 'Day 1-3', text: 'Pickup completed' },
  { day: 'Day 4-5', text: 'Quality check at our facility' },
  { day: 'Day 5-7', text: 'Refund processed to original payment method' },
];

export function Returns() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 lg:px-6">
      <div className="text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl gradient-stellar text-white"><RotateCcw className="h-7 w-7" /></div>
        <h1 className="mt-4 text-3xl font-bold">Returns & Refunds</h1>
        <p className="mt-2 text-muted">We make returns simple. Here is everything you need to know.</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Clock, t: '10-Day Window', s: 'Request a return within 10 days of delivery.' },
          { icon: Truck, t: 'Free Pickup', s: 'We pick up the item at no cost to you.' },
          { icon: Shield, t: 'Warranty', s: 'All products include manufacturer warranty.' },
        ].map((x) => (
          <div key={x.t} className="rounded-card border border-base bg-elevated p-5">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-stellar-500/10 text-stellar-500"><x.icon className="h-5 w-5" /></div>
            <h3 className="mt-3 font-bold">{x.t}</h3>
            <p className="mt-1 text-sm text-muted">{x.s}</p>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Return Process</h2>
        <div className="mt-4 space-y-4">
          {steps.map((s, i) => (
            <div key={s.title} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="grid h-9 w-9 place-items-center rounded-full gradient-stellar text-sm font-bold text-white">{i + 1}</div>
                {i < steps.length - 1 && <div className="mt-1 h-full w-0.5 flex-1 bg-base" />}
              </div>
              <div className="pb-4">
                <h3 className="font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold">Refund Timeline</h2>
        <div className="mt-4 overflow-hidden rounded-card border border-base">
          {timeline.map((t, i) => (
            <div key={t.day} className={`flex items-center gap-4 p-4 ${i % 2 === 0 ? 'bg-soft' : ''}`}>
              <span className="w-20 shrink-0 text-sm font-bold text-stellar-600 dark:text-stellar-300">{t.day}</span>
              <span className="text-sm text-muted">{t.text}</span>
              <Check className="ml-auto h-4 w-4 text-success-500" />
            </div>
          ))}
        </div>
      </section>

      <section className="mt-10 rounded-card border border-base bg-elevated p-5">
        <h2 className="flex items-center gap-2 text-lg font-bold"><Headphones className="h-5 w-5 text-stellar-500" /> Need help?</h2>
        <p className="mt-2 text-sm text-muted">Our support team is available 24/7. Reach us at care@stellarshop.com or 1800-123-4567.</p>
        <div className="mt-4 flex gap-2">
          <Link to="/orders"><Button>View my orders</Button></Link>
          <Link to="/contact"><Button variant="outline">Contact support</Button></Link>
        </div>
      </section>
    </div>
  );
}
