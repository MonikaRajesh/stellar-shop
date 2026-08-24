import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { productMap } from '@/data/products';
import { formatINR } from '@/utils/format';
import { setCartPreviewOpen } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';

export function CartPreview() {
  const open = useAppSelector((s) => s.ui.cartPreviewOpen);
  const cartItems = useAppSelector((s) => s.cart.items.filter((i) => !i.savedForLater));
  const dispatch = useAppDispatch();

  const items = cartItems.slice(0, 3).map((i) => ({ ...i, product: productMap[i.productId] })).filter((i) => i.product);
  const total = cartItems.reduce((sum, i) => sum + (productMap[i.productId]?.price || 0) * i.quantity, 0);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(setCartPreviewOpen(false))}
            className="fixed inset-0 z-[80] md:hidden"
          />
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="absolute right-0 top-full z-[81] mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-base bg-elevated shadow-float"
          >
            <div className="flex items-center justify-between border-b border-base px-4 py-3">
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <ShoppingCart className="h-4 w-4" /> Recently added
              </h3>
              <button onClick={() => dispatch(setCartPreviewOpen(false))} className="text-muted hover:text-base">
                <X className="h-4 w-4" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <ShoppingCart className="mx-auto h-10 w-10 text-muted" />
                <p className="mt-2 text-sm text-muted">Your cart is empty</p>
                <Link to="/offers" onClick={() => dispatch(setCartPreviewOpen(false))} className="mt-3 inline-block text-sm font-semibold text-stellar-600 dark:text-stellar-300">
                  Browse deals
                </Link>
              </div>
            ) : (
              <>
                <ul className="max-h-72 divide-y divide-[var(--border)] overflow-y-auto">
                  {items.map((i) => (
                    <li key={i.productId} className="flex gap-3 p-3">
                      <img src={i.product.images[0]} onError={fallbackProductImage} alt={i.product.name} className="h-14 w-14 rounded-lg object-cover" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{i.product.name}</p>
                        <p className="text-xs text-muted">Qty {i.quantity}</p>
                        <p className="text-sm font-bold">{formatINR(i.product.price * i.quantity)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="border-t border-base p-3">
                  <div className="flex items-center justify-between px-1 text-sm">
                    <span className="text-muted">Subtotal</span>
                    <span className="font-bold">{formatINR(total)}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    <Link to="/cart" onClick={() => dispatch(setCartPreviewOpen(false))}>
                      <Button variant="outline" size="sm" className="w-full">View Cart</Button>
                    </Link>
                    <Link to="/checkout" onClick={() => dispatch(setCartPreviewOpen(false))}>
                      <Button size="sm" className="w-full">Checkout</Button>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
