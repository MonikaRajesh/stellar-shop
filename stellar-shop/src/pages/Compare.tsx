import { Link } from 'react-router-dom';
import { GitCompare, X, Check, Minus, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { removeFromCompare, clearCompare } from '@/redux/slices/compareSlice';
import { formatINR, discountPercent } from '@/utils/format';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';

export function Compare() {
  const ids = useAppSelector((s) => s.compare);
  const dispatch = useAppDispatch();
  const items = ids.map((id) => productMap[id]).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <GitCompare className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-4 text-2xl font-bold">Nothing to compare yet</h1>
        <p className="mt-2 text-muted">Add products to compare their specs side by side.</p>
        <Link to="/"><Button className="mt-5">Browse products <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    );
  }

  const rows: { label: string; render: (p: typeof items[number]) => React.ReactNode }[] = [
    { label: 'Price', render: (p) => <span className="font-bold">{formatINR(p.price)}</span> },
    { label: 'Discount', render: (p) => `${discountPercent(p.mrp, p.price)}% off` },
    { label: 'Brand', render: (p) => p.brand },
    { label: 'Category', render: (p) => p.category },
    { label: 'Rating', render: (p) => <Rating value={p.rating} count={p.reviewCount} showCount={false} /> },
    { label: 'Stock', render: (p) => p.stock > 0 ? <span className="text-success-500">In stock</span> : <span className="text-error-500">Out of stock</span> },
    ...items[0].specs.map((s) => ({
      label: s.label,
      render: (p: typeof items[number]) => {
        const spec = p.specs.find((x) => x.label === s.label);
        return spec ? spec.value : <Minus className="h-4 w-4 text-muted" />;
      },
    })),
    { label: 'Highlights', render: (p) => (
      <ul className="space-y-1 text-left">
        {p.highlights.slice(0, 3).map((h) => <li key={h} className="flex items-start gap-1.5 text-xs"><Check className="mt-0.5 h-3 w-3 shrink-0 text-success-500" /> {h}</li>)}
      </ul>
    ) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Compare Products</h1>
        {items.length > 0 && <Button size="sm" variant="outline" onClick={() => dispatch(clearCompare())}>Clear all</Button>}
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="w-32 p-3 text-left align-top"></th>
              {items.map((p) => (
                <th key={p.id} className="p-3 text-left align-top" style={{ minWidth: 200 }}>
                  <div className="relative rounded-card border border-base bg-elevated p-3">
                    <button onClick={() => dispatch(removeFromCompare(p.id))} className="absolute right-2 top-2 text-muted hover:text-error-500"><X className="h-4 w-4" /></button>
                    <Link to={`/product/${p.slug}`}>
                      <img src={p.images[0]} onError={fallbackProductImage} alt={p.name} className="aspect-square w-full rounded-lg object-cover" />
                    </Link>
                    <p className="mt-2 text-xs text-muted">{p.brand}</p>
                    <Link to={`/product/${p.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-stellar-600">{p.name}</Link>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <tr key={r.label} className={ri % 2 === 0 ? 'bg-soft' : ''}>
                <td className="p-3 text-sm font-semibold text-muted">{r.label}</td>
                {items.map((p) => (
                  <td key={p.id} className="p-3 text-sm">{r.render(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
