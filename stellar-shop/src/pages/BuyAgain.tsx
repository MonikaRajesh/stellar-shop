import { Link } from 'react-router-dom';
import { Repeat2, ArrowRight, ShoppingCart } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { formatINR } from '@/utils/format';
import { addToCart } from '@/redux/slices/cartSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { Rating } from '@/components/ui/Rating';
import { Button } from '@/components/ui/Button';

export function BuyAgain() {
  const orders = useAppSelector((s) => s.orders);
  const dispatch = useAppDispatch();

  const productIds = [...new Set(orders.flatMap((o) => o.items.map((i) => i.productId)))];
  const items = productIds.map((id) => productMap[id]).filter(Boolean);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Repeat2 className="mx-auto h-16 w-16 text-muted" />
        <h1 className="mt-4 text-2xl font-bold">No purchases yet</h1>
        <p className="mt-2 text-muted">Products you have ordered will show here for one-tap reordering.</p>
        <Link to="/"><Button className="mt-5">Start shopping <ArrowRight className="h-4 w-4" /></Button></Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <h1 className="text-2xl font-bold">Buy Again</h1>
      <p className="mt-1 text-sm text-muted">Reorder your past purchases in one tap.</p>
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
            <Button size="sm" className="mt-3" onClick={() => { dispatch(addToCart({ productId: p.id })); dispatch(addToast({ message: 'Added to cart', type: 'success' })); }}>
              <ShoppingCart className="h-4 w-4" /> Buy again
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
