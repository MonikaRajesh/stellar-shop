import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/redux/store';
import { AuthBootstrap } from '@/components/auth/AuthBootstrap';

const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })));
const Category = lazy(() => import('@/pages/Category').then((m) => ({ default: m.Category })));
const ProductDetails = lazy(() => import('@/pages/ProductDetails').then((m) => ({ default: m.ProductDetails })));
const Cart = lazy(() => import('@/pages/Cart').then((m) => ({ default: m.Cart })));
const Checkout = lazy(() => import('@/pages/Checkout').then((m) => ({ default: m.Checkout })));
const Offers = lazy(() => import('@/pages/Offers').then((m) => ({ default: m.Offers })));
const Wishlist = lazy(() => import('@/pages/Wishlist').then((m) => ({ default: m.Wishlist })));
const Compare = lazy(() => import('@/pages/Compare').then((m) => ({ default: m.Compare })));
const Orders = lazy(() => import('@/pages/Orders').then((m) => ({ default: m.Orders })));
const BuyAgain = lazy(() => import('@/pages/BuyAgain').then((m) => ({ default: m.BuyAgain })));
const RecentlyViewed = lazy(() => import('@/pages/RecentlyViewed').then((m) => ({ default: m.RecentlyViewed })));
const Returns = lazy(() => import('@/pages/Returns').then((m) => ({ default: m.Returns })));
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })));
const Register = lazy(() => import('@/pages/Register').then((m) => ({ default: m.Register })));
const Profile = lazy(() => import('@/pages/Profile').then((m) => ({ default: m.Profile })));
const Info = lazy(() => import('@/pages/Info').then((m) => ({ default: m.Info })));
const VerifyEmail = lazy(() => import('@/pages/VerifyEmail').then((m) => ({ default: m.VerifyEmail })));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard').then((m) => ({ default: m.AdminDashboard })));
const AdminLogin = lazy(() => import('@/pages/AdminLogin').then((m) => ({ default: m.AdminLogin })));

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const user = useAppSelector((s) => s.auth.user);
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <>{children}</>;
}

function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="text-6xl font-extrabold gradient-text">404</h1>
      <p className="mt-4 text-lg font-semibold">Page not found</p>
      <p className="mt-2 text-sm text-muted">The page you are looking for does not exist or has moved.</p>
      <a href="/" className="mt-5 inline-block rounded-xl gradient-stellar px-6 py-2.5 text-sm font-semibold text-white">Back to home</a>
    </div>
  );
}

function App() {
  return (<>
    <AuthBootstrap />
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/search" element={<Category />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
        <Route path="/buy-again" element={<ProtectedRoute><BuyAgain /></ProtectedRoute>} />
        <Route path="/recently-viewed" element={<ProtectedRoute><RecentlyViewed /></ProtectedRoute>} />
        <Route path="/returns" element={<ProtectedRoute><Returns /></ProtectedRoute>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<Navigate to="/login" replace />} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/profile/:section" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/info/:topic" element={<Info />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </>);
}

export default App;
