import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { clearRecentlyViewed } from '@/redux/slices/recentlyViewedSlice';
import { addToCart } from '@/redux/slices/cartSlice';
import { addToast, setQuickView } from '@/redux/slices/uiSlice';
import { formatINR } from '@/utils/format';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';

export function RecentlyViewed() {
  const ids = useAppSelector((s) => s.recentlyViewed);
  const dispatch = useAppDispatch();
  const items = ids.map((id) => productMap[id]).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Clock className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-4 text-2xl font-bold">No recently viewed products</h1>
        <p className="mt-2 text-muted">Products you view will appear here for quick access.</p>
        <Link to="/"><Button className="mt-5">Start exploring <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Recently Viewed</h1>
        <Button size="sm" variant="outline" onClick={() => dispatch(clearRecentlyViewed())}>Clear</Button>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((p) => p && (
          <div key={p.id} className="flex flex-col rounded-card border border-base bg-elevated p-3">
            <Link to={`/product/${p.slug}`} className="overflow-hidden rounded-xl bg-soft">
              <img src={p.images[0]} onError={fallbackProductImage} alt={p.name} className="aspect-square w-full object-cover" />
            </Link>
            <p className="mt-2 text-xs text-muted">{p.brand}</p>
            <Link to={`/product/${p.slug}`} className="line-clamp-2 text-sm font-semibold hover:text-stellar-600">{p.name}</Link>
            <Rating value={p.rating} count={p.reviewCount} />
            <span className="mt-1 font-bold">{formatINR(p.price)}</span>
            <div className="mt-3 flex gap-2">
              <Button size="sm" className="flex-1" onClick={() => { dispatch(addToCart({ productId: p.id })); dispatch(addToast({ message: 'Added to cart', type: 'success' })); }}>Add</Button>
              <Button size="sm" variant="outline" onClick={() => dispatch(setQuickView(p.id))}>Quick view</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
