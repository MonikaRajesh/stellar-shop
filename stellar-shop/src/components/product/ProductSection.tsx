import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/types';
import { ProductCard } from './ProductCard';

interface ProductSectionProps {
  title: string;
  subtitle?: string;
  products: Product[];
  viewAllTo?: string;
  badge?: string;
}

export function ProductSection({ title, subtitle, products, viewAllTo, badge }: ProductSectionProps) {
  if (products.length === 0) return null;
  return (
    <section className="py-6">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
            {badge && (
              <span className="rounded-full bg-stellar-500/10 px-2.5 py-0.5 text-xs font-semibold text-stellar-600 dark:text-stellar-300">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
        </div>
        {viewAllTo && (
          <Link
            to={viewAllTo}
            className="group inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-stellar-600 dark:text-stellar-300 hover:gap-2 transition-all"
          >
            View all
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      <div className="-mx-1 flex gap-4 overflow-x-auto px-1 pb-2 no-scrollbar snap-x snap-mandatory">
        {products.map((p, i) => (
          <div key={p.id} className="w-[260px] shrink-0 snap-start sm:w-[280px]">
            <ProductCard product={p} index={i} />
          </div>
        ))}
      </div>
    </section>
  );
}
