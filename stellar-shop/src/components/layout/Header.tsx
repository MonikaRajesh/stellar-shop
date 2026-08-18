import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Home, ChevronDown, Heart, ShoppingCart, Bell, User, Sun, Moon, Menu, X,
  Mic, Camera, ScanLine, Package, Repeat2, Clock, CreditCard, Tag, Star,
  Settings as SettingsIcon, Shield, LogOut, MapPin, Zap, Sparkles,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { toggleTheme } from '@/redux/slices/themeSlice';
import { setMobileMenuOpen, setCartPreviewOpen, setVoiceSearchOpen, setImageSearchOpen, setScannerOpen, addToast } from '@/redux/slices/uiSlice';
import { logout } from '@/redux/slices/authSlice';
import { categories } from '@/data/categories';
import { SearchBar } from '@/components/search/SearchBar';
import { CartPreview } from './CartPreview';
import { signOutSupabase } from '@/services/auth';

export function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const theme = useAppSelector((s) => s.theme);
  const cartCount = useAppSelector((s) => s.cart.items.filter((i) => !i.savedForLater).reduce((n, i) => n + i.quantity, 0));
  const wishlistCount = useAppSelector((s) => s.wishlist.length);
  const user = useAppSelector((s) => s.auth.user);
  const mobileMenuOpen = useAppSelector((s) => s.ui.mobileMenuOpen);

  const [scrolled, setScrolled] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const profileLinks = [
    { to: '/profile', label: 'My Profile', icon: User },
    { to: '/orders', label: 'My Orders', icon: Package },
    { to: '/buy-again', label: 'Buy Again', icon: Repeat2 },
    { to: '/recently-viewed', label: 'Recently Viewed', icon: Clock },
    { to: '/wishlist', label: 'Wishlist', icon: Heart },
    { to: '/compare', label: 'Compare', icon: ScanLine },
    { to: '/profile/addresses', label: 'Saved Addresses', icon: MapPin },
    { to: '/profile/payments', label: 'Payment Methods', icon: CreditCard },
    { to: '/profile/coupons', label: 'Coupons', icon: Tag },
    { to: '/returns', label: 'Returns', icon: Repeat2 },
    { to: '/profile/reviews', label: 'Reviews', icon: Star },
    { to: '/profile/settings', label: 'Settings', icon: SettingsIcon },
    { to: '/profile/security', label: 'Security', icon: Shield },
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-soft' : 'bg-base'}`}>
      <div className="border-b border-base">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 lg:px-6">
          {/* Mobile menu */}
          <button
            className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft lg:hidden"
            onClick={() => dispatch(setMobileMenuOpen(true))}
            aria-label="Menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex shrink-0 items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl gradient-stellar text-white shadow-[0_4px_14px_-4px_rgba(51,102,255,0.6)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="hidden sm:block">
              <p className="font-display text-lg font-extrabold leading-none tracking-tight">Stellar<span className="gradient-text">Shop</span></p>
              <p className="text-[10px] font-medium uppercase tracking-widest text-muted">Electronics</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="ml-2 hidden items-center gap-1 lg:flex">
            <NavItem to="/" icon={<Home className="h-4 w-4" />} label="Home" />
            <div ref={catRef} className="relative">
              <button
                onClick={() => setCatOpen((v) => !v)}
                className="flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium hover:bg-soft transition"
              >
                Categories <ChevronDown className={`h-4 w-4 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {catOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full mt-2 w-[34rem] rounded-2xl border border-base bg-elevated p-3 shadow-float"
                  >
                    <div className="grid grid-cols-2 gap-1">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/category/${c.slug}`}
                          onClick={() => setCatOpen(false)}
                          className="flex items-center gap-3 rounded-lg p-2 hover:bg-soft transition"
                        >
                          <img src={c.image} alt={c.name} className="h-10 w-10 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-semibold">{c.name}</p>
                            <p className="text-xs text-muted">{c.productCount} items</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <NavItem to="/offers" icon={<Zap className="h-4 w-4" />} label="Offers" />
          </nav>

          {/* Search */}
          <div className="flex-1 px-1 lg:px-3">
            <SearchBar />
          </div>

          {/* Mobile search tools */}
          <div className="flex items-center gap-0.5 sm:hidden">
            <button onClick={() => dispatch(setVoiceSearchOpen(true))} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft" aria-label="Voice search">
              <Mic className="h-5 w-5" />
            </button>
            <button onClick={() => dispatch(setImageSearchOpen(true))} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft" aria-label="Image search">
              <Camera className="h-5 w-5" />
            </button>
            <button onClick={() => dispatch(setScannerOpen(true))} className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft" aria-label="Scanner">
              <ScanLine className="h-5 w-5" />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => dispatch(toggleTheme())}
              className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft transition"
              aria-label="Toggle dark mode"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            <Link to="/wishlist" className="relative hidden h-10 w-10 place-items-center rounded-lg hover:bg-soft sm:grid" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && <Counter n={wishlistCount} />}
            </Link>

            <button className="relative hidden h-10 w-10 place-items-center rounded-lg hover:bg-soft sm:grid" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-error-500" />
            </button>

            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => dispatch(setCartPreviewOpen(true))}
                onMouseEnter={() => dispatch(setCartPreviewOpen(true))}
                className="relative grid h-10 w-10 place-items-center rounded-lg hover:bg-soft transition"
                aria-label="Cart"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && <Counter n={cartCount} />}
              </button>
              <CartPreview />
            </div>

            {/* Profile */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="grid h-10 w-10 place-items-center rounded-lg hover:bg-soft transition"
                aria-label="Profile"
              >
                <div className="grid h-7 w-7 place-items-center rounded-full gradient-stellar text-xs font-bold text-white">
                  {user ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
                </div>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-2xl border border-base bg-elevated shadow-float"
                  >
                    {user ? (
                      <div className="border-b border-base p-3">
                        <p className="text-sm font-bold">{user.name}</p>
                        <p className="truncate text-xs text-muted">{user.email}</p>
                      </div>
                    ) : (
                      <div className="border-b border-base p-3">
                        <p className="text-sm font-semibold">Welcome to Stellar Shop</p>
                        <div className="mt-2 flex gap-2">
                          <Link to="/login" onClick={() => setProfileOpen(false)} className="flex-1 rounded-lg gradient-stellar py-1.5 text-center text-xs font-semibold text-white">Login</Link>
                          <Link to="/register" onClick={() => setProfileOpen(false)} className="flex-1 rounded-lg border border-base py-1.5 text-center text-xs font-semibold hover:bg-soft">Sign up</Link>
                        </div>
                      </div>
                    )}
                    <ul className="max-h-80 overflow-y-auto py-1">
                      {profileLinks.map((l) => (
                        <li key={l.to}>
                          <Link to={l.to} onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-3 py-2 text-sm hover:bg-soft transition">
                            <l.icon className="h-4 w-4 text-muted" /> {l.label}
                          </Link>
                        </li>
                      ))}
                      {user && (
                        <li>
                          <button
                            onClick={() => { void signOutSupabase(); dispatch(logout()); setProfileOpen(false); dispatch(addToast({ message: 'Logged out', type: 'info' })); navigate('/'); }}
                            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-error-500 hover:bg-soft transition"
                          >
                            <LogOut className="h-4 w-4" /> Logout
                          </button>
                        </li>
                      )}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => dispatch(setMobileMenuOpen(false))}
              className="fixed inset-0 z-[70] bg-ink-950/50 backdrop-blur-sm lg:hidden" />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="fixed left-0 top-0 z-[71] h-full w-80 max-w-[85vw] overflow-y-auto border-r border-base bg-elevated p-4 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <Link to="/" onClick={() => dispatch(setMobileMenuOpen(false))} className="flex items-center gap-2">
                  <div className="grid h-9 w-9 place-items-center rounded-xl gradient-stellar text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <span className="font-display text-lg font-extrabold">Stellar<span className="gradient-text">Shop</span></span>
                </Link>
                <button onClick={() => dispatch(setMobileMenuOpen(false))} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-soft">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="mt-4 space-y-1">
                <MobileLink to="/" label="Home" icon={Home} onClick={() => dispatch(setMobileMenuOpen(false))} />
                <MobileLink to="/offers" label="Offers" icon={Zap} onClick={() => dispatch(setMobileMenuOpen(false))} />
                <MobileLink to="/wishlist" label="Wishlist" icon={Heart} onClick={() => dispatch(setMobileMenuOpen(false))} />
                <MobileLink to="/orders" label="My Orders" icon={Package} onClick={() => dispatch(setMobileMenuOpen(false))} />
                <MobileLink to="/compare" label="Compare" icon={ScanLine} onClick={() => dispatch(setMobileMenuOpen(false))} />
              </nav>

              <p className="mt-4 px-2 text-xs font-semibold uppercase tracking-wide text-muted">Categories</p>
              <div className="mt-1 space-y-0.5">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.slug}`}
                    onClick={() => dispatch(setMobileMenuOpen(false))}
                    className="flex items-center gap-3 rounded-lg p-2 text-sm hover:bg-soft transition"
                  >
                    <img src={c.image} alt="" className="h-8 w-8 rounded-lg object-cover" />
                    {c.name}
                  </Link>
                ))}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}

function NavItem({ to, icon, label }: { to: string; icon: React.ReactNode; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        `flex h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-medium transition ${isActive ? 'text-stellar-600 dark:text-stellar-300 bg-stellar-500/10' : 'hover:bg-soft'}`
      }
    >
      {icon} {label}
    </NavLink>
  );
}

function MobileLink({ to, label, icon: Icon, onClick }: { to: string; label: string; icon: typeof Home; onClick: () => void }) {
  return (
    <Link to={to} onClick={onClick} className="flex items-center gap-3 rounded-lg p-2.5 text-sm font-medium hover:bg-soft transition">
      <Icon className="h-5 w-5 text-muted" /> {label}
    </Link>
  );
}

function Counter({ n }: { n: number }) {
  return (
    <span className="absolute -right-0.5 -top-0.5 grid h-4.5 min-w-4.5 place-items-center rounded-full bg-error-500 px-1 text-[10px] font-bold text-white" style={{ height: 18, minWidth: 18 }}>
      {n > 9 ? '9+' : n}
    </span>
  );
}
