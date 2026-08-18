import { lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';

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
const Admin = lazy(() => import('@/pages/Admin').then((m) => ({ default: m.Admin })));

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
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/category/:slug" element={<Category />} />
        <Route path="/search" element={<Category />} />
        <Route path="/product/:slug" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/compare" element={<Compare />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/buy-again" element={<BuyAgain />} />
        <Route path="/recently-viewed" element={<RecentlyViewed />} />
        <Route path="/returns" element={<Returns />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:section" element={<Profile />} />
        <Route path="/info/:topic" element={<Info />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}

export default App;
