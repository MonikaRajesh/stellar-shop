import { Link } from 'react-router-dom';
import { Zap, Clock, Gift, Percent, Tag, ArrowRight } from 'lucide-react';
import { offers, coupons } from '@/data/offers';
import { productsByTag } from '@/data/products';
import { ProductSection } from '@/components/product/ProductSection';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Countdown } from '@/components/home/Countdown';

const typeMeta: Record<string, { icon: typeof Zap; color: string }> = {
  flash: { icon: Zap, color: 'text-error-500' },
  today: { icon: Clock, color: 'text-warning-500' },
  new_user: { icon: Gift, color: 'text-success-500' },
  bundle: { icon: Percent, color: 'text-stellar-500' },
  seasonal: { icon: Tag, color: 'text-accent-500' },
};

export function Offers() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      {/* Hero */}
      <div className="overflow-hidden rounded-card gradient-stellar p-8 text-center text-white">
        <Badge className="mb-3 bg-white/20 text-white border-white/30">Limited time</Badge>
        <h1 className="text-3xl font-extrabold md:text-4xl">Stellar Offers</h1>
        <p className="mx-auto mt-2 max-w-md text-white/80">The best electronics deals, refreshed daily. Grab them before they are gone.</p>
      </div>

      {/* Offer cards with countdown */}
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {offers.map((o) => {
          const meta = typeMeta[o.type];
          return (
            <div key={o.id} className="overflow-hidden rounded-card border border-base bg-elevated">
              <div className="relative h-40">
                <img src={o.image} alt={o.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 to-transparent" />
                <div className="absolute left-4 top-4"><Badge variant="stellar">{o.discount}</Badge></div>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <meta.icon className={`h-5 w-5 ${meta.color}`} />
                  <h2 className="text-lg font-bold">{o.title}</h2>
                </div>
                <p className="mt-1 text-sm text-muted">{o.subtitle}</p>
                <div className="mt-3 flex items-center justify-between">
                  <Countdown target={o.endsAt} />
                  <Link to="/search?q=offers"><Button size="sm" variant="outline">Shop now <ArrowRight className="h-4 w-4" /></Button></Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Coupons */}
      <section className="mt-10">
        <h2 className="text-xl font-bold">Available Coupons</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div key={c.code} className="flex items-center justify-between rounded-card border border-dashed border-base bg-elevated p-4">
              <div>
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-stellar-500" />
                  <span className="font-bold tracking-wide">{c.code}</span>
                </div>
                <p className="mt-1 text-sm text-muted">{c.description}</p>
              </div>
              <Button size="sm" variant="outline">Copy</Button>
            </div>
          ))}
        </div>
      </section>

      {/* Product sections */}
      <div className="mt-8">
        <ProductSection title="Flash Sale" badge="Hot" products={productsByTag('flash')} viewAllTo="/search?q=flash" />
        <ProductSection title="Today's Deals" products={productsByTag('today')} viewAllTo="/search?q=today" />
        <ProductSection title="Best Sellers" products={productsByTag('bestseller')} viewAllTo="/search?q=bestseller" />
      </div>
    </div>
  );
}
