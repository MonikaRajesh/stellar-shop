import { useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import { productsByCategory, products } from '@/data/products';
import { categories } from '@/data/categories';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { classNames } from '@/utils/format';

type Sort = 'relevance' | 'priceLow' | 'priceHigh' | 'rating' | 'discount';

export function Category() {
  const { slug } = useParams();
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [sort, setSort] = useState<Sort>('relevance');
  const [maxPrice, setMaxPrice] = useState(200000);
  const [showFilters, setShowFilters] = useState(false);

  const category = categories.find((c) => c.slug === slug);

  const filtered = useMemo(() => {
    let list = slug ? productsByCategory(category?.id || '') : products;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((p) => (p.name + p.brand + p.category).toLowerCase().includes(q));
    }
    list = list.filter((p) => p.price <= maxPrice);
    switch (sort) {
      case 'priceLow': list = [...list].sort((a, b) => a.price - b.price); break;
      case 'priceHigh': list = [...list].sort((a, b) => b.price - a.price); break;
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
      case 'discount': list = [...list].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp); break;
    }
    return list;
  }, [slug, query, sort, maxPrice, category]);

  const title = query ? `Results for "${query}"` : category?.name || 'All Products';

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="mt-1 text-sm text-muted">{filtered.length} products found</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowFilters((v) => !v)} className="inline-flex items-center gap-2 rounded-lg border border-base px-3 py-2 text-sm font-medium hover:bg-soft lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="h-10 appearance-none rounded-lg border border-base bg-elevated pl-3 pr-9 text-sm font-medium outline-none focus:border-stellar-400"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Rating</option>
              <option value="discount">Discount</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-4">
        {/* Filters */}
        <aside className={classNames('lg:block', showFilters ? 'block' : 'hidden')}>
          <div className="rounded-card border border-base bg-elevated p-4 lg:sticky lg:top-24">
            <h3 className="text-sm font-bold">Filters</h3>
            <div className="mt-4">
              <p className="text-sm font-semibold">Max Price</p>
              <input type="range" min={1000} max={200000} step={1000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="mt-2 w-full accent-stellar-500" />
              <p className="mt-1 text-xs text-muted">Up to ₹{maxPrice.toLocaleString('en-IN')}</p>
            </div>
            {slug && (
              <div className="mt-4">
                <p className="text-sm font-semibold">Brands</p>
                <div className="mt-2 space-y-1.5">
                  {[...new Set(filtered.map((p) => p.brand))].map((b) => (
                    <label key={b} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" className="accent-stellar-500" /> {b}
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Grid */}
        <div className="lg:col-span-3">
          {filtered.length === 0 ? (
            <ProductGridSkeleton count={6} />
          ) : (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {filtered.map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
