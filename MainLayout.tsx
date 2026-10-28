import { Suspense, lazy } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ToastContainer } from '@/components/ui/ToastContainer';
import { QuickViewModal } from '@/components/product/QuickViewModal';
import { VoiceSearchModal } from '@/components/search/VoiceSearchModal';
import { ImageSearchModal } from '@/components/search/ImageSearchModal';
import { ScannerModal } from '@/components/search/ScannerModal';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export function MainLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Header />
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Suspense fallback={<div className="mx-auto max-w-7xl px-4 py-10"><ProductGridSkeleton /></div>}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <ToastContainer />
      <QuickViewModal />
      <VoiceSearchModal />
      <ImageSearchModal />
      <ScannerModal />
    </div>
  );
}
