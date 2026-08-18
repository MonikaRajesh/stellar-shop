import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Truck, RotateCcw, Star, Quote } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';

import { products, productsByTag, formatINR, discountPercent } from '@/data/products';
import { categories, brands } from '@/data/categories';
import { offers, customerReviews } from '@/data/offers';
import { useAppSelector } from '@/redux/store';
import { ProductSection } from '@/components/product/ProductSection';
import { ProductCard } from '@/components/product/ProductCard';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Rating } from '@/components/ui/Rating';
import { Countdown } from '@/components/home/Countdown';

const heroSlides = [
  {
    title: 'Nuvora Pulse 14 Pro',
    sub: 'The flagship that rewrites the rules',
    cta: 'Shop now',
    to: '/product/nuvora-pulse-14-pro',
    image: '/products/788946.svg',
    align: 'left' as const,
  },
  {
    title: 'Orbital Studio Max',
    sub: 'Silence the world. Hear everything.',
    cta: 'Discover audio',
    to: '/product/orbital-studio-max',
    image: '/products/3394651.svg',
    align: 'right' as const,
  },
  {
    title: 'Vortex Console X Pro',
    sub: '4K gaming. Zero compromises.',
    cta: 'Level up',
    to: '/product/vortex-console-x-pro',
    image: '/products/2115256.svg',
    align: 'left' as const,
  },
];

export function Home() {
  const recentlyViewed = useAppSelector((s) => s.recentlyViewed);
  const recentlyViewedProducts = recentlyViewed.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;

  return (
    <div className="mx-auto max-w-7xl px-4 lg:px-6">
      {/* Hero */}
      <section className="relative mt-4">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, EffectFade]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          navigation
          loop
          className="h-[280px] overflow-hidden rounded-card sm:h-[360px] lg:h-[440px]"
        >
          {heroSlides.map((s) => (
            <SwiperSlide key={s.title}>
              <div className="relative h-full w-full">
                <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-ink-950/80 via-ink-950/40 to-transparent" />
                <div className={`absolute inset-0 flex flex-col justify-center px-6 sm:px-12 ${s.align === 'right' ? 'items-end text-right' : 'items-start'}`}>
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                    <Badge variant="stellar" className="mb-3">Featured</Badge>
                    <h2 className="max-w-md font-display text-2xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">{s.title}</h2>
                    <p className="mt-2 max-w-sm text-sm text-white/80 sm:text-lg">{s.sub}</p>
                    <Link to={s.to}>
                      <Button className="mt-5" size="lg">{s.cta} <ArrowRight className="h-4 w-4" /></Button>
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Trust strip */}
      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { icon: Truck, t: 'Free shipping', s: 'Over ₹499' },
          { icon: Shield, t: 'Secure payments', s: 'SSL encrypted' },
          { icon: RotateCcw, t: '10-day returns', s: 'No questions' },
          { icon: Zap, t: 'Fast delivery', s: 'Next-day available' },
        ].map((x) => (
          <div key={x.t} className="flex items-center gap-3 rounded-xl border border-base bg-elevated p-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-stellar-500/10 text-stellar-500">
              <x.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-semibold">{x.t}</p>
              <p className="text-xs text-muted">{x.s}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Flash sale with countdown */}
      <section className="mt-8 overflow-hidden rounded-card border border-base gradient-hero">
        <div className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-warning-500" />
              <h2 className="text-xl font-bold md:text-2xl">Flash Sale</h2>
            </div>
            <p className="mt-1 text-sm text-muted">Up to 60% off — ends soon</p>
          </div>
          <Countdown target={offers[0].endsAt} />
        </div>
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {productsByTag('flash').slice(0, 4).map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <ProductSection title="Today's Deals" badge="Hot" products={productsByTag('today').concat(products.slice(2, 6))} viewAllTo="/offers" />
      <ProductSection title="Featured Electronics" products={productsByTag('featured')} viewAllTo="/category/smartphones" />
      <ProductSection title="Trending Products" badge="Trending" products={productsByTag('trending')} viewAllTo="/search?q=trending" />

      {/* Top categories */}
      <section className="py-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Top Categories</h2>
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {categories.slice(0, 12).map((c, i) => (
            <motion.div key={c.id} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
              <Link to={`/category/${c.slug}`} className="group flex flex-col items-center gap-2 rounded-card border border-base bg-elevated p-4 transition hover:-translate-y-1 hover:shadow-soft hover:border-stellar-300">
                <div className="overflow-hidden rounded-xl">
                  <img src={c.image} alt={c.name} className="h-16 w-16 object-cover transition group-hover:scale-110" />
                </div>
                <p className="text-center text-xs font-semibold">{c.name}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <ProductSection title="Best Sellers" badge="Top" products={productsByTag('bestseller')} viewAllTo="/search?q=bestseller" />
      <ProductSection title="New Arrivals" badge="New" products={productsByTag('new')} viewAllTo="/search?q=new" />

      {/* Offers banner */}
      <section className="py-6">
        <div className="grid gap-4 md:grid-cols-3">
          {offers.slice(0, 3).map((o) => (
            <Link key={o.id} to="/offers" className="group relative overflow-hidden rounded-card border border-base">
              <img src={o.image} alt={o.title} className="h-40 w-full object-cover transition group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
              <div className="absolute bottom-0 p-4">
                <Badge variant="stellar">{o.discount}</Badge>
                <h3 className="mt-2 text-lg font-bold text-white">{o.title}</h3>
                <p className="text-sm text-white/80">{o.subtitle}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <ProductSection title="Recommended For You" products={[...products].sort((a, b) => b.rating - a.rating).slice(0, 10)} viewAllTo="/search?q=recommended" />

      {/* Popular brands */}
      <section className="py-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Popular Brands</h2>
        <div className="flex flex-wrap gap-3">
          {brands.map((b, i) => (
            <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
              <div className="flex items-center gap-3 rounded-2xl border border-base bg-elevated px-5 py-3 transition hover:-translate-y-1 hover:shadow-soft">
                <div className="grid h-10 w-10 place-items-center rounded-full text-sm font-bold" style={{ backgroundColor: b.logoColor + '20', color: b.logoColor }}>
                  {b.name.charAt(0)}
                </div>
                <span className="font-semibold">{b.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {recentlyViewedProducts.length > 0 && (
        <ProductSection title="Recently Viewed" products={recentlyViewedProducts} viewAllTo="/recently-viewed" />
      )}

      {/* Special offers */}
      <section className="py-6">
        <div className="overflow-hidden rounded-card gradient-stellar p-8 text-center text-white">
          <h2 className="text-2xl font-bold md:text-3xl">Special Offers</h2>
          <p className="mx-auto mt-2 max-w-md text-white/80">New users get ₹500 off the first order. Use code STELLAR500 at checkout.</p>
          <Link to="/offers"><Button variant="secondary" size="lg" className="mt-5">Explore offers <ArrowRight className="h-4 w-4" /></Button></Link>
        </div>
      </section>

      {/* Customer reviews */}
      <section className="py-6">
        <h2 className="mb-4 text-xl font-bold tracking-tight md:text-2xl">Customer Reviews</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {customerReviews.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
              className="rounded-card border border-base bg-elevated p-5">
              <Quote className="h-6 w-6 text-stellar-500/40" />
              <p className="mt-2 text-sm text-muted">{r.text}</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full gradient-stellar text-sm font-bold text-white">{r.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold">{r.name}</p>
                  <p className="text-xs text-muted">{r.location}</p>
                </div>
                <div className="ml-auto flex">
                  {Array.from({ length: r.rating }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-warning-500 text-warning-500" />)}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Returns/refund info */}
      <section className="py-6">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { icon: RotateCcw, t: '10-Day Returns', s: 'Return any item within 10 days for a full refund. No questions asked.' },
            { icon: Shield, t: 'Warranty Included', s: 'Every product comes with a manufacturer warranty for peace of mind.' },
            { icon: Truck, t: 'Fast & Free Shipping', s: 'Free shipping on orders over ₹499, with next-day delivery available.' },
          ].map((x) => (
            <div key={x.t} className="rounded-card border border-base bg-elevated p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-stellar-500/10 text-stellar-500"><x.icon className="h-5 w-5" /></div>
              <h3 className="mt-3 font-bold">{x.t}</h3>
              <p className="mt-1 text-sm text-muted">{x.s}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
