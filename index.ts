export type ID = string;

export interface Category {
  id: ID;
  name: string;
  slug: string;
  icon: string; // lucide icon name
  image: string;
  productCount: number;
}

export interface Brand {
  id: ID;
  name: string;
  slug: string;
  logoColor: string;
}

export interface ProductSpec {
  label: string;
  value: string;
}

export interface Review {
  id: ID;
  author: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  helpful: number;
}

export interface Product {
  id: ID;
  name: string;
  slug: string;
  brand: string;
  brandId: ID;
  category: string;
  categoryId: ID;
  price: number;
  mrp: number;
  rating: number;
  reviewCount: number;
  stock: number;
  images: string[];
  colors: { name: string; hex: string }[];
  highlights: string[];
  specs: ProductSpec[];
  description: string;
  warranty: string;
  returnPolicy: string;
  delivery: string;
  tags: string[];
  badge?: string;
  createdAt: string;
  reviews: Review[];
  frequentlyBoughtTogether?: ID[];
}

export interface Offer {
  id: ID;
  title: string;
  subtitle: string;
  type: 'flash' | 'today' | 'new_user' | 'bundle' | 'seasonal';
  endsAt: string;
  code: string;
  discount: string;
  image: string;
}
