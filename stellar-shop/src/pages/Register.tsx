import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, ArrowRight, Check } from 'lucide-react';
import { useAppDispatch } from '@/redux/store';
import { loginSuccess } from '@/redux/slices/authSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { classNames } from '@/utils/format';
import { isSupabaseConfigured } from '@/lib/supabase';
import { signUpWithSupabase } from '@/services/auth';

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', mobile: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) { dispatch(addToast({ message: 'Passwords do not match', type: 'error' })); return; }

    if (isSupabaseConfigured) {
      try {
        const data = await signUpWithSupabase({ email: form.email, password: form.password, name: form.name, mobile: form.mobile });
        if (data?.session && data.user) {
          dispatch(loginSuccess({ user: { id: data.user.id, name: form.name, email: form.email, mobile: form.mobile }, token: data.session.access_token }));
          dispatch(addToast({ message: 'Account created successfully!', type: 'success' }));
          navigate('/');
        } else {
          dispatch(addToast({ message: 'Account created. Check your email to confirm your account, then sign in.', type: 'success' }));
          navigate('/login');
        }
      } catch (error: any) {
        dispatch(addToast({ message: error?.message || 'Could not create account.', type: 'error' }));
      }
      return;
    }

    dispatch(loginSuccess({ user: { id: 'u1', name: form.name, email: form.email, mobile: form.mobile }, token: 'demo-token' }));
    dispatch(addToast({ message: 'Account created! Welcome to Stellar Shop.', type: 'success' }));
    navigate('/');
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Aarav Mehta' },
    { key: 'username', label: 'Username', type: 'text', icon: User, placeholder: 'aarav_m' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { key: 'mobile', label: 'Mobile Number', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
  ];

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><Sparkles className="h-6 w-6" /></div>
          <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
          <p className="mt-1 text-sm text-muted">Join Stellar Shop and get ₹500 off your first order</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="text-sm font-semibold">{f.label}</label>
              <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3">
                <f.icon className="h-4 w-4 text-muted" />
                <input value={form[f.key as keyof typeof form]} onChange={(e) => set(f.key, e.target.value)} required type={f.type} placeholder={f.placeholder} className="w-full bg-transparent text-sm outline-none" />
              </div>
            </div>
          ))}
          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3">
              <Lock className="h-4 w-4 text-muted" />
              <input value={form.password} onChange={(e) => set('password', e.target.value)} required type={show ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" />
              <button type="button" onClick={() => setShow((v) => !v)} className="text-muted hover:text-base">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Confirm Password</label>
            <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3">
              <Lock className="h-4 w-4 text-muted" />
              <input value={form.confirm} onChange={(e) => set('confirm', e.target.value)} required type={show ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <label className="flex items-start gap-2 text-sm">
            <input type="checkbox" checked={terms} onChange={(e) => setTerms(e.target.checked)} required className="mt-0.5 accent-stellar-500" />
            <span className="text-muted">I agree to the <Link to="/terms" className="font-medium text-stellar-600 dark:text-stellar-300">Terms & Conditions</Link> and <Link to="/privacy" className="font-medium text-stellar-600 dark:text-stellar-300">Privacy Policy</Link></span>
          </label>
          <Button type="submit" size="lg" disabled={!terms} className="w-full">Create account <ArrowRight className="h-4 w-4" /></Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">{isSupabaseConfigured ? 'Authentication is powered by Supabase.' : 'Demo mode — add Supabase environment variables for real authentication.'}</p>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="font-semibold text-stellar-600 dark:text-stellar-300">Sign in</Link></p>
      </motion.div>
    </div>
  );
}
