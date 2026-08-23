import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Mic, X, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setVoiceSearchOpen, addToast } from '@/redux/slices/uiSlice';
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';
import { products } from '@/data/products';

export function VoiceSearchModal() {
  const open = useAppSelector((s) => s.ui.voiceSearchOpen);
  const dispatch = useAppDispatch();
  const { supported, listening, transcript, error, start, stop, reset } = useSpeechRecognition();
  const [searched, setSearched] = useState(false);
  const startedRef = useRef(false);

  useEffect(() => {
    if (open && supported && !startedRef.current) {
      startedRef.current = true;
      start();
    }
    if (!open) {
      startedRef.current = false;
      stop();
      reset();
      setSearched(false);
    }
  }, [open, supported, start, stop, reset]);

  const results = transcript
    ? products.filter((p) =>
        (p.name + p.brand + p.category).toLowerCase().includes(transcript.toLowerCase())
      ).slice(0, 5)
    : [];

  const close = () => dispatch(setVoiceSearchOpen(false));

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
            className="w-full max-w-md rounded-card border border-base bg-elevated p-6 shadow-float text-center"
          >
            <button onClick={close} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-soft">
              <X className="h-4 w-4" />
            </button>

            {!supported ? (
              <div className="py-8">
                <Mic className="mx-auto h-12 w-12 text-muted" />
                <h3 className="mt-4 text-lg font-bold">Voice search unavailable</h3>
                <p className="mt-2 text-sm text-muted">
                  Your browser does not support speech recognition. Try Chrome or Edge, or use the text search instead.
                </p>
                <button
                  onClick={() => { dispatch(setVoiceSearchOpen(false)); dispatch(addToast({ message: 'Use the search bar instead', type: 'info' })); }}
                  className="mt-4 text-sm font-semibold text-stellar-600 dark:text-stellar-300"
                >
                  Use text search
                </button>
              </div>
            ) : (
              <>
                <div className="relative mx-auto grid h-24 w-24 place-items-center">
                  {listening && (
                    <>
                      <span className="pulse-ring absolute inset-0 text-stellar-500" />
                      <span className="pulse-ring absolute inset-0 text-stellar-500" style={{ animationDelay: '0.5s' }} />
                    </>
                  )}
                  <div className={`grid h-20 w-20 place-items-center rounded-full transition-colors ${listening ? 'gradient-stellar text-white' : 'bg-soft text-muted'}`}>
                    <Mic className="h-8 w-8" />
                  </div>
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {listening ? 'Listening…' : transcript ? 'Heard:' : 'Tap to speak'}
                </h3>
                {transcript && (
                  <p className="mt-1 rounded-lg bg-soft px-4 py-2 text-base font-medium">"{transcript}"</p>
                )}
                {error && <p className="mt-2 text-sm text-error-500">{error}</p>}

                <div className="mt-4 flex justify-center gap-2">
                  <button
                    onClick={() => { reset(); start(); }}
                    className="rounded-lg border border-base px-4 py-2 text-sm font-semibold hover:bg-soft"
                  >
                    {listening ? 'Restart' : 'Start'}
                  </button>
                  <button
                    onClick={stop}
                    className="rounded-lg border border-base px-4 py-2 text-sm font-semibold hover:bg-soft"
                  >
                    Stop
                  </button>
                </div>

                {transcript && results.length > 0 && (
                  <div className="mt-5 space-y-2 text-left">
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted">Results</p>
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        to={`/product/${p.slug}`}
                        onClick={close}
                        className="flex items-center gap-3 rounded-lg border border-base p-2 hover:bg-soft transition"
                      >
                        <img src={p.images[0]} alt={p.name} className="h-12 w-12 rounded-lg object-cover" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">{p.name}</p>
                          <p className="text-xs text-muted">{p.brand}</p>
                        </div>
                        <Search className="h-4 w-4 text-muted" />
                      </Link>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
