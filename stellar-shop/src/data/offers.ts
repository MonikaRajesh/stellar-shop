import type { Offer } from '@/types';

export const offers: Offer[] = [
  {
    id: 'o1',
    title: 'Flash Sale: Up to 60% Off',
    subtitle: '4 hours only — grab the best electronics deals before they are gone.',
    type: 'flash',
    endsAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    code: 'FLASH60',
    discount: 'Up to 60% off',
    image: '/products/356056.svg',
  },
  {
    id: 'o2',
    title: "Today's Deals",
    subtitle: 'Hand-picked deals refreshed every day at midnight.',
    type: 'today',
    endsAt: new Date(Date.now() + 20 * 3600 * 1000).toISOString(),
    code: 'TODAY20',
    discount: 'Up to 40% off',
    image: '/products/18105.svg',
  },
  {
    id: 'o3',
    title: 'New User Offer: ₹500 Off',
    subtitle: 'First order? Get ₹500 off on cart above ₹2,999. No strings attached.',
    type: 'new_user',
    endsAt: new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
    code: 'STELLAR500',
    discount: '₹500 off',
    image: '/products/4968391.svg',
  },
  {
    id: 'o4',
    title: 'Bundle & Save 25%',
    subtitle: 'Buy a laptop + accessories together and save big on the bundle.',
    type: 'bundle',
    endsAt: new Date(Date.now() + 12 * 86400 * 1000).toISOString(),
    code: 'BUNDLE25',
    discount: '25% off bundles',
    image: '/products/1029757.svg',
  },
  {
    id: 'o5',
    title: 'Seasonal Spectacular',
    subtitle: 'Festive season savings across smartphones, audio, and gaming.',
    type: 'seasonal',
    endsAt: new Date(Date.now() + 18 * 86400 * 1000).toISOString(),
    code: 'SEASON15',
    discount: '15% off',
    image: '/products/264787.svg',
  },
];

export const customerReviews = [
  { id: 'cr1', name: 'Ananya R.', location: 'Bengaluru', rating: 5, text: 'Stellar Shop is now my default for electronics. The packaging, the delivery speed, the returns — everything feels premium.' },
  { id: 'cr2', name: 'Rohit K.', location: 'Mumbai', rating: 5, text: 'I bought a laptop and the price was the best I could find anywhere. Checkout was smooth and it arrived next day.' },
  { id: 'cr3', name: 'Sara P.', location: 'Delhi', rating: 4, text: 'Love the dark mode and the product comparison feature. It actually helped me choose between two phones.' },
  { id: 'cr4', name: 'Vikram S.', location: 'Hyderabad', rating: 5, text: 'The flash sales are real. I snagged earbuds at 50% off with zero issues. Highly recommend.' },
];

export const coupons = [
  { code: 'STELLAR500', description: '₹500 off on orders above ₹2,999', type: 'new_user' },
  { code: 'FLASH60', description: 'Up to 60% off during flash sale', type: 'flash' },
  { code: 'TODAY20', description: 'Extra 20% off on today\'s deals', type: 'today' },
  { code: 'BUNDLE25', description: '25% off on accessory bundles', type: 'bundle' },
  { code: 'SEASON15', description: '15% off festive season', type: 'seasonal' },
];
