import { Link, useParams } from 'react-router-dom';
import { User, MapPin, CreditCard, Tag, Settings as SettingsIcon, Shield, Star, Bell } from 'lucide-react';
import { useAppSelector } from '@/redux/store';
import { Button } from '@/components/ui/Button';

const sections: Record<string, { title: string; content: React.ReactNode }> = {
  overview: {
    title: 'My Profile',
    content: (
      <div className="space-y-4">
        <p className="text-sm text-muted">Manage your account details and preferences.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Saved Addresses', to: '/profile/addresses', icon: MapPin },
            { label: 'Payment Methods', to: '/profile/payments', icon: CreditCard },
            { label: 'Coupons', to: '/profile/coupons', icon: Tag },
            { label: 'My Reviews', to: '/profile/reviews', icon: Star },
            { label: 'Notifications', to: '/profile/notifications', icon: Bell },
            { label: 'Settings', to: '/profile/settings', icon: SettingsIcon },
            { label: 'Security', to: '/profile/security', icon: Shield },
          ].map((x) => (
            <Link key={x.label} to={x.to} className="flex items-center gap-3 rounded-xl border border-base bg-elevated p-4 hover:border-stellar-300 hover:shadow-soft transition">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-stellar-500/10 text-stellar-500"><x.icon className="h-5 w-5" /></div>
              <span className="text-sm font-semibold">{x.label}</span>
            </Link>
          ))}
        </div>
      </div>
    ),
  },
  addresses: { title: 'Saved Addresses', content: <PlaceholderList items={['12 Orion Lane, Indiranagar, Bengaluru, KA 560038', '447 Galaxy Towers, Bandra West, Mumbai, MH 400050']} /> },
  payments: { title: 'Payment Methods', content: <PlaceholderList items={['Visa ending in 4242', 'UPI: aarav@stellarupi']} /> },
  coupons: { title: 'My Coupons', content: <PlaceholderList items={['STELLAR500 — ₹500 off', 'FLASH60 — Up to 60% off', 'BUNDLE25 — 25% off bundles']} /> },
  reviews: { title: 'My Reviews', content: <p className="text-sm text-muted">You have not written any reviews yet. Share your experience with products you have purchased.</p> },
  notifications: { title: 'Notifications', content: <p className="text-sm text-muted">No new notifications. You will see order updates and deal alerts here.</p> },
  settings: { title: 'Settings', content: <p className="text-sm text-muted">Manage your account preferences, language, and display options including dark mode from the header toggle.</p> },
  security: { title: 'Security', content: <p className="text-sm text-muted">Change your password, enable two-factor authentication, and review recent login activity. Demo mode — no real security backend is connected.</p> },
};

function PlaceholderList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it} className="rounded-xl border border-base bg-elevated p-4 text-sm">{it}</li>
      ))}
    </ul>
  );
}

export function Profile() {
  const { section } = useParams();
  const user = useAppSelector((s) => s.auth.user);
  const key = section && sections[section] ? section : 'overview';
  const active = sections[key];

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 lg:px-6">
      {/* Header card */}
      <div className="flex items-center gap-4 rounded-card border border-base bg-elevated p-5">
        <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-stellar text-2xl font-bold text-white">
          {user ? user.name.charAt(0).toUpperCase() : <User className="h-7 w-7" />}
        </div>
        <div>
          <h1 className="text-xl font-bold">{user ? user.name : 'Guest User'}</h1>
          <p className="text-sm text-muted">{user ? user.email : 'Not signed in'}</p>
        </div>
        {!user && <Link to="/login" className="ml-auto"><Button size="sm">Sign in</Button></Link>}
      </div>

      {/* Section nav */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {Object.entries(sections).map(([k, v]) => (
          <Link
            key={k}
            to={k === 'overview' ? '/profile' : `/profile/${k}`}
            className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition ${key === k ? 'gradient-stellar text-white' : 'border border-base hover:bg-soft'}`}
          >
            {v.title}
          </Link>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 rounded-card border border-base bg-elevated p-5">
        <h2 className="text-lg font-bold">{active.title}</h2>
        <div className="mt-4">{active.content}</div>
      </div>
    </div>
  );
}
