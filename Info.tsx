import { useParams } from 'react-router-dom';
import { Shield, FileText, Truck, RotateCcw, CreditCard, Headphones } from 'lucide-react';

const pages: Record<string, { icon: typeof Shield; title: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    icon: Shield,
    title: 'Privacy Policy',
    sections: [
      { heading: 'Information We Collect', body: 'We collect information you provide directly — name, email, mobile, and delivery address — when you create an account or place an order. We also collect usage data such as pages visited and products viewed to improve your experience.' },
      { heading: 'How We Use Your Information', body: 'Your information is used to process orders, provide customer support, personalize recommendations, and send transactional updates. We never sell your personal data to third parties.' },
      { heading: 'Data Security', body: 'All data is encrypted in transit using TLS and at rest using industry-standard encryption. Passwords are hashed with bcrypt. Access is restricted to authorized personnel only.' },
      { heading: 'Your Rights', body: 'You can request access to, correction of, or deletion of your personal data at any time. Contact our privacy team at privacy@stellarshop.com.' },
    ],
  },
  terms: {
    icon: FileText,
    title: 'Terms & Conditions',
    sections: [
      { heading: 'Acceptance of Terms', body: 'By accessing or using Stellar Shop, you agree to be bound by these Terms & Conditions. If you do not agree, please discontinue use of the platform.' },
      { heading: 'Account Responsibility', body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.' },
      { heading: 'Product Information', body: 'We strive for accuracy in product descriptions, pricing, and availability. However, errors may occur. We reserve the right to correct errors and alter pricing without notice.' },
      { heading: 'Limitation of Liability', body: 'Stellar Shop is not liable for indirect, incidental, or consequential damages arising from the use of our products or services.' },
    ],
  },
  shipping: {
    icon: Truck,
    title: 'Shipping Policy',
    sections: [
      { heading: 'Free Shipping', body: 'Enjoy free standard shipping on all orders above ₹499. Orders below this threshold incur a flat ₹49 shipping fee.' },
      { heading: 'Delivery Timelines', body: 'Standard delivery takes 3-5 business days. Next-day delivery is available for select pin codes on orders placed before 2 PM.' },
      { heading: 'Order Tracking', body: 'Track your order in real time from the My Orders page. You will receive SMS and email updates at each stage of delivery.' },
      { heading: 'International Shipping', body: 'Currently, Stellar Shop delivers only within India. International shipping will be available soon.' },
    ],
  },
  returns: {
    icon: RotateCcw,
    title: 'Return Policy',
    sections: [
      { heading: '10-Day Return Window', body: 'You can request a return within 10 days of delivery. The product must be in its original condition with all accessories and packaging.' },
      { heading: 'Non-Returnable Items', body: 'Certain items are not eligible for return, including opened software, hygiene products, and items damaged due to misuse.' },
      { heading: 'Free Pickup', body: 'We arrange free doorstep pickup for all eligible returns. No need to visit a courier office.' },
      { heading: 'Refund Processing', body: 'Refunds are processed to the original payment method within 5-7 business days after the returned item passes quality inspection.' },
    ],
  },
  refunds: {
    icon: CreditCard,
    title: 'Refund Policy',
    sections: [
      { heading: 'Refund Timeline', body: 'Refunds are initiated within 24 hours of quality check approval and reflect in your account within 5-7 business days, depending on your bank.' },
      { heading: 'Refund Methods', body: 'Refunds are credited to the original payment method. For COD orders, refunds are processed to your bank account or wallet.' },
      { heading: 'Partial Refunds', body: 'In cases of damaged or missing accessories, a partial refund may be issued based on the condition of the returned product.' },
    ],
  },
  help: {
    icon: Headphones,
    title: 'Help Center',
    sections: [
      { heading: 'Contact Us', body: 'Our support team is available 24/7. Email us at care@stellarshop.com or call 1800-123-4567.' },
      { heading: 'Order Issues', body: 'For order-related concerns, visit the My Orders page to track, return, or request support for any order.' },
      { heading: 'Account & Security', body: 'Manage your account settings, passwords, and security preferences from the Profile section.' },
    ],
  },
  contact: {
    icon: Headphones,
    title: 'Contact Us',
    sections: [
      { heading: 'Customer Support', body: 'Email: care@stellarshop.com | Phone: 1800-123-4567 (toll-free, 24/7)' },
      { heading: 'Corporate Office', body: 'Orion Tech Park, Outer Ring Road, Bengaluru, Karnataka 560038' },
      { heading: 'Business Inquiries', body: 'For partnerships and seller registrations, write to business@stellarshop.com.' },
    ],
  },
};

export function Info() {
  const { topic } = useParams();
  const page = topic && pages[topic] ? pages[topic] : pages.help;
  const Icon = page.icon;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 lg:px-6">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><Icon className="h-6 w-6" /></div>
        <h1 className="text-2xl font-bold">{page.title}</h1>
      </div>
      <div className="mt-6 space-y-6">
        {page.sections.map((s) => (
          <div key={s.heading} className="rounded-card border border-base bg-elevated p-5">
            <h2 className="text-lg font-bold">{s.heading}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
