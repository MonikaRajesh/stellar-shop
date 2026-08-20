import { Link } from 'react-router-dom';
import { Sparkles, Shield, Truck, RotateCcw, Headphones, Mail, Phone, MapPin } from 'lucide-react';
import { brands } from '@/data/categories';

const sections = [
  {
    title: 'Shop',
    links: [
      { label: 'Electronics', to: '/category/smartphones' },
      { label: 'Categories', to: '/' },
      { label: 'New Arrivals', to: '/?section=new' },
      { label: 'Best Sellers', to: '/?section=bestsellers' },
      { label: 'Offers', to: '/offers' },
    ],
  },
  {
    title: 'Customer Service',
    links: [
      { label: 'Help Center', to: '/help' },
      { label: 'Contact Us', to: '/contact' },
      { label: 'Returns', to: '/returns' },
      { label: 'Refunds', to: '/refunds' },
      { label: 'Shipping', to: '/shipping' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'My Account', to: '/profile' },
      { label: 'Orders', to: '/orders' },
      { label: 'Wishlist', to: '/wishlist' },
      { label: 'Buy Again', to: '/buy-again' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms & Conditions', to: '/terms' },
      { label: 'Shipping Policy', to: '/shipping' },
      { label: 'Return Policy', to: '/returns' },
      { label: 'Refund Policy', to: '/refunds' },
    ],
  },
];

const payments = ['UPI', 'Cards', 'Net Banking', 'Wallets', 'COD'];

export function Footer() {
  return (
    <footer className="mt-12 border-t border-base bg-soft">
      {/* Trust strip */}
      <div className="border-b border-base">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 md:grid-cols-4 lg:px-6">
          {[
            { icon: Shield, title: 'Secure Payments', text: '256-bit SSL encryption' },
            { icon: Truck, title: 'Fast Delivery', text: 'Next-day on most items' },
            { icon: RotateCcw, title: 'Easy Returns', text: '10-day return window' },
            { icon: Headphones, title: '24/7 Support', text: 'Always here to help' },
          ].map((t) => (
            <div key={t.title} className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-elevated text-stellar-500 shadow-soft">
                <t.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold">{t.title}</p>
                <p className="text-xs text-muted">{t.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div className="mx-auto max-w-7xl px-4 py-10 lg:px-6">
        <div className="rounded-card gradient-hero border border-base p-8 text-center">
          <h3 className="text-xl font-bold md:text-2xl">Join the Stellar circle</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">Get exclusive deals, early access to drops, and ₹500 off your first order.</p>
          <form onSubmit={(e) => e.preventDefault()} className="mx-auto mt-5 flex max-w-md gap-2">
            <input type="email" placeholder="Enter your email" className="h-11 flex-1 rounded-xl border border-base bg-elevated px-4 text-sm outline-none focus:border-stellar-400" />
            <button className="h-11 rounded-xl gradient-stellar px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5">Subscribe</button>
          </form>
        </div>
      </div>

      {/* Links */}
      <div className="mx-auto max-w-7xl px-4 pb-8 lg:px-6">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-stellar text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <span className="font-display text-lg font-extrabold">Stellar<span className="gradient-text">Shop</span></span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">Premium electronics, delivered. A futuristic marketplace for the tech you love.</p>
            <div className="mt-4 space-y-1.5 text-sm text-muted">
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Orion Tech Park, Bengaluru, KA</p>
              <p className="flex items-center gap-2"><Phone className="h-4 w-4" /> 1800-123-4567</p>
              <p className="flex items-center gap-2"><Mail className="h-4 w-4" /> care@stellarshop.com</p>
            </div>
          </div>

          {sections.map((s) => (
            <div key={s.title}>
              <p className="text-sm font-bold">{s.title}</p>
              <ul className="mt-3 space-y-2">
                {s.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="text-sm text-muted hover:text-stellar-600 dark:hover:text-stellar-300 transition">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Brands */}
        <div className="mt-8 border-t border-base pt-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Popular Brands</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {brands.map((b) => (
              <span key={b.id} className="rounded-lg border border-base px-3 py-1.5 text-sm font-medium" style={{ color: b.logoColor }}>{b.name}</span>
            ))}
          </div>
        </div>

        {/* Payments */}
        <div className="mt-6 flex flex-col items-center justify-between gap-4 border-t border-base pt-6 sm:flex-row">
          <p className="text-xs text-muted">© {new Date().getFullYear()} Stellar Shop. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-2">
            {payments.map((p) => (
              <span key={p} className="rounded-md border border-base bg-elevated px-2.5 py-1 text-xs font-semibold">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
