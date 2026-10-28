import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Mic, Camera, ScanLine, X, TrendingUp } from 'lucide-react';
import { useAppDispatch } from '@/redux/store';
import { setVoiceSearchOpen, setImageSearchOpen, setScannerOpen } from '@/redux/slices/uiSlice';
import { useDebounce } from '@/hooks/useDebounce';
import { products } from '@/data/products';
import { categories } from '@/data/categories';

const trending = ['Nuvora Pulse 14 Pro', 'Wireless Earbuds', 'Gaming Laptop', 'Smartwatch', '4K Monitor'];

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const debounced = useDebounce(query, 250);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setFocused(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const suggestions = useMemo(() => {
    if (!debounced.trim()) return [];
    const q = debounced.toLowerCase();
    const productMatches = products
      .filter((p) => (p.name + p.brand + p.category).toLowerCase().includes(q))
      .slice(0, 6);
    const categoryMatches = categories
      .filter((c) => c.name.toLowerCase().includes(q))
      .slice(0, 3)
      .map((c) => ({ type: 'category' as const, ...c }));
    return [...productMatches.map((p) => ({ type: 'product' as const, ...p })), ...categoryMatches];
  }, [debounced]);

  const submit = (q?: string) => {
    const term = (q ?? query).trim();
    if (!term) return;
    setFocused(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="flex h-11 items-center gap-2 rounded-xl border border-base bg-soft px-3 transition focus-within:border-stellar-400 focus-within:shadow-glow">
        <Search className="h-4 w-4 shrink-0 text-muted" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          placeholder="Search Stellar Shop for electronics…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-muted"
        />
        {query && (
          <button onClick={() => setQuery('')} className="text-muted hover:text-base">
            <X className="h-4 w-4" />
          </button>
        )}
        <div className="hidden items-center gap-0.5 sm:flex">
          <button onClick={() => dispatch(setVoiceSearchOpen(true))} aria-label="Voice search" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-stellar-500 transition">
            <Mic className="h-4 w-4" />
          </button>
          <button onClick={() => dispatch(setImageSearchOpen(true))} aria-label="Image search" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-stellar-500 transition">
            <Camera className="h-4 w-4" />
          </button>
          <button onClick={() => dispatch(setScannerOpen(true))} aria-label="Scanner" className="grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-ink-100 dark:hover:bg-ink-800 hover:text-stellar-500 transition">
            <ScanLine className="h-4 w-4" />
          </button>
        </div>
      </div>

      {focused && (suggestions.length > 0 || !query.trim()) && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-base bg-elevated shadow-float">
          {!query.trim() ? (
            <div className="p-3">
              <p className="px-1 text-xs font-semibold uppercase tracking-wide text-muted">Trending searches</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {trending.map((t) => (
                  <button
                    key={t}
                    onClick={() => { setQuery(t); submit(t); }}
                    className="inline-flex items-center gap-1.5 rounded-full border border-base px-3 py-1.5 text-sm font-medium hover:bg-soft transition"
                  >
                    <TrendingUp className="h-3.5 w-3.5 text-stellar-500" />
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <ul className="max-h-80 overflow-y-auto py-1">
              {suggestions.map((s) => (
                <li key={s.type === 'product' ? s.id : s.slug}>
                  <button
                    onClick={() => submit(s.type === 'product' ? s.name : s.name)}
                    className="flex w-full items-center gap-3 px-3 py-2 text-left hover:bg-soft transition"
                  >
                    {s.type === 'product' && 'images' in s && (
                      <img src={(s as { images: string[] }).images[0]} onError={fallbackProductImage} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    )}
                    {s.type === 'category' && (
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-stellar-500/10">
                        <Search className="h-4 w-4 text-stellar-500" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{s.name}</p>
                      <p className="text-xs text-muted">{s.type === 'product' ? s.brand : 'Category'}</p>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}


function fallbackProductImage(e: React.SyntheticEvent<HTMLImageElement>) { e.currentTarget.onerror = null; e.currentTarget.src = "/branding/product-placeholder.svg"; }
