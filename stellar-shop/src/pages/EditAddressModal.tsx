import { useEffect, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import type { Order } from '@/redux/slices/ordersSlice';
import { Button } from '@/components/ui/Button';

export function EditAddressModal({ order, onClose, onSave }: { order: Order; onClose: () => void; onSave: (address: string) => Promise<void> | void }) {
  const [address, setAddress] = useState(order.address);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !busy) onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [busy, onClose]);

  const save = async () => {
    const value = address.trim();
    if (value.length < 10) { setError('Please enter a complete delivery address.'); return; }
    setBusy(true); setError('');
    try { await onSave(value); onClose(); } catch (e) { setError(e instanceof Error ? e.message : 'Unable to update the address.'); } finally { setBusy(false); }
  };

  return (
    <div className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4" role="dialog" aria-modal="true" onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="w-full max-w-lg rounded-2xl border border-base bg-elevated shadow-float">
        <div className="flex items-center justify-between border-b border-base px-5 py-4">
          <div><h2 className="text-lg font-bold">Edit delivery address</h2><p className="text-xs text-muted">Order {order.id}</p></div>
          <button type="button" onClick={onClose} disabled={busy} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-soft" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>
        <div className="p-5">
          <label className="flex items-center gap-2 text-sm font-semibold"><MapPin className="h-4 w-4 text-stellar-500" /> Delivery address</label>
          <textarea value={address} onChange={(e) => setAddress(e.target.value)} rows={4} className="mt-2 w-full resize-none rounded-xl border border-base bg-transparent p-3 text-sm outline-none focus:border-stellar-400" placeholder="House/flat, street, area, city, state, PIN code" />
          {error && <p className="mt-2 text-sm text-error-500">{error}</p>}
          <p className="mt-2 text-xs text-muted">Update the delivery address for this order. Make sure the new address is complete before saving.</p>
          <div className="mt-5 flex justify-end gap-2"><Button type="button" variant="outline" onClick={onClose} disabled={busy}>Cancel</Button><Button type="button" loading={busy} onClick={() => void save()}>Save address</Button></div>
        </div>
      </div>
    </div>
  );
}
