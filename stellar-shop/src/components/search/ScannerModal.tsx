import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ScanLine, X, Camera, Keyboard } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { setScannerOpen, addToast } from '@/redux/slices/uiSlice';

export function ScannerModal() {
  const open = useAppSelector((s) => s.ui.scannerOpen);
  const dispatch = useAppDispatch();
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');

  useEffect(() => {
    if (!open) {
      stopCamera();
      setManualCode('');
      setError(null);
    }
  }, [open]);

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  };

  const startCamera = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraOn(true);
    } catch {
      setError('Camera access was denied or is unavailable. Enter a code manually instead.');
    }
  };

  const close = () => {
    stopCamera();
    dispatch(setScannerOpen(false));
  };

  const submitManual = () => {
    if (!manualCode.trim()) return;
    dispatch(addToast({ message: `Searching for code: ${manualCode}`, type: 'info' }));
    close();
  };

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
            className="relative w-full max-w-md rounded-card border border-base bg-elevated p-6 shadow-float"
          >
            <button onClick={close} className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full hover:bg-soft">
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-lg font-bold">Scan a code</h3>
            <p className="mt-1 text-sm text-muted">Scan a barcode or QR code to find a product instantly.</p>

            <div className="mt-5 overflow-hidden rounded-2xl border border-base bg-ink-950">
              <div className="relative aspect-square">
                {cameraOn ? (
                  <video ref={videoRef} className="h-full w-full object-cover" playsInline muted />
                ) : (
                  <div className="grid h-full place-items-center text-ink-500">
                    <ScanLine className="h-16 w-16" />
                  </div>
                )}
                {/* Scanner frame overlay */}
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute inset-8 rounded-xl border-2 border-white/70" />
                  <motion.div
                    className="absolute left-8 right-8 h-0.5 bg-accent-400 shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                    initial={{ top: '15%' }}
                    animate={{ top: ['15%', '85%', '15%'] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </div>
            </div>

            {error && <p className="mt-3 text-sm text-error-500">{error}</p>}

            <div className="mt-4 flex gap-2">
              {!cameraOn ? (
                <button
                  onClick={startCamera}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl gradient-stellar text-sm font-semibold text-white"
                >
                  <Camera className="h-4 w-4" /> Start camera
                </button>
              ) : (
                <button
                  onClick={stopCamera}
                  className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-base text-sm font-semibold hover:bg-soft"
                >
                  Stop camera
                </button>
              )}
            </div>

            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted">Enter code manually</label>
              <div className="mt-1.5 flex gap-2">
                <div className="flex h-10 flex-1 items-center gap-2 rounded-lg border border-base px-3">
                  <Keyboard className="h-4 w-4 text-muted" />
                  <input
                    value={manualCode}
                    onChange={(e) => setManualCode(e.target.value)}
                    placeholder="Barcode or QR value"
                    className="w-full bg-transparent text-sm outline-none"
                  />
                </div>
                <button
                  onClick={submitManual}
                  className="rounded-lg border border-base px-4 text-sm font-semibold hover:bg-soft"
                >
                  Search
                </button>
              </div>
            </div>

            <p className="mt-3 text-xs text-muted">
              Note: live barcode/QR decoding will be connected in a later stage. The camera preview is live now.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
