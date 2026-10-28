import { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Upload, X, Image as ImageIcon, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setImageSearchOpen, addToast } from '@/redux/slices/uiSlice';
import { products } from '@/data/products';

export function ImageSearchModal() {
  const open = useAppSelector((s) => s.ui.imageSearchOpen);
  const dispatch = useAppDispatch();
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const close = () => {
    dispatch(setImageSearchOpen(false));
    setPreview(null);
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      dispatch(addToast({ message: 'Please select an image file', type: 'error' }));
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  // Mock "visual search": until an AI vision backend is connected we return a
  // sample of products as suggestions and clearly label this as a demo.
  const results = preview ? products.slice(0, 6) : [];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
          className="fixed inset-0 z-[90] grid place-items-center bg-ink-950/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-card border border-base bg-elevated p-6 shadow-float"
          >
            <button onClick={close} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-soft">
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold">Visual Search</h3>
            <p className="mt-1 text-sm text-muted">Upload a photo of a product and we will find similar items for you.</p>

            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
            <input ref={cameraRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />

            {!preview ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-base p-8 transition hover:border-stellar-400 hover:bg-soft"
                >
                  <Upload className="h-8 w-8 text-stellar-500" />
                  <span className="text-sm font-semibold">Upload image</span>
                </button>
                <button
                  onClick={() => cameraRef.current?.click()}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-base p-8 transition hover:border-stellar-400 hover:bg-soft"
                >
                  <Camera className="h-8 w-8 text-stellar-500" />
                  <span className="text-sm font-semibold">Capture photo</span>
                </button>
              </div>
            ) : (
              <>
                <div className="mt-5 overflow-hidden rounded-2xl border border-base">
                  <img src={preview} alt="Search preview" className="h-48 w-full object-cover" />
                </div>
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-stellar-500/10 px-3 py-2 text-xs text-stellar-600 dark:text-stellar-300">
                  <ImageIcon className="h-4 w-4 shrink-0" />
                  Demo mode: visual AI matching is not yet connected. Showing sample results below.
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {results.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.slug}`}
                      onClick={close}
                      className="group overflow-hidden rounded-xl border border-base bg-soft transition hover:shadow-soft"
                    >
                      <img src={p.images[0]} onError={fallbackProductImage} alt={p.name} className="aspect-square w-full object-cover" />
                      <p className="line-clamp-1 px-2 py-1.5 text-xs font-semibold">{p.name}</p>
                    </Link>
                  ))}
                </div>

                <button
                  onClick={() => setPreview(null)}
                  className="mt-4 w-full rounded-lg border border-base py-2 text-sm font-semibold hover:bg-soft"
                >
                  Choose a different image
                </button>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
