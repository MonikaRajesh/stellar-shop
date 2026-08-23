import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { FaGoogle, FaLinkedinIn, FaGithub, FaMicrosoft } from 'react-icons/fa';
import { useAppDispatch } from '@/redux/store';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { signInWithOAuthProvider, signUpWithSupabase } from '@/services/supabase';
import { supabaseEnabled } from '@/lib/supabase';
import { Turnstile } from '@/components/auth/Turnstile';

type SocialProvider = 'google' | 'linkedin_oidc' | 'github' | 'azure';

export function Register() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', username: '', email: '', mobile: '', password: '', confirm: '' });
  const [show, setShow] = useState(false);
  const [terms, setTerms] = useState(false);
  const [busy, setBusy] = useState(false);
  const [captchaToken, setCaptchaToken] = useState('');
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const enabledSocialProviders = String(import.meta.env.VITE_ENABLE_GOOGLE_OAUTH || '').toLowerCase() === 'true' ? ['google'] as SocialProvider[] : [];

  const socialSignup = async (provider: SocialProvider) => {
    if (!supabaseEnabled) {
      dispatch(addToast({ message: 'Authentication is not configured. Add Supabase environment variables first.', type: 'error' }));
      return;
    }
    setBusy(true);
    const result = await signInWithOAuthProvider(provider);
    setBusy(false);
    if (result.error) dispatch(addToast({ message: result.error.message || 'Unable to start social sign-up.', type: 'error' }));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseEnabled) { dispatch(addToast({ message: 'Authentication is not configured. Add Supabase environment variables first.', type: 'error' })); return; }
    if (!terms) { dispatch(addToast({ message: 'Please accept the Terms and Privacy Policy.', type: 'error' })); return; }
    if (form.password !== form.confirm) { dispatch(addToast({ message: 'Passwords do not match', type: 'error' })); return; }
    if (form.password.length < 8) { dispatch(addToast({ message: 'Password must be at least 8 characters.', type: 'error' })); return; }
    setBusy(true);
    const result = await signUpWithSupabase(form.email.trim(), form.password, { name: form.name.trim(), mobile: form.mobile.trim(), username: form.username.trim() }, captchaToken || undefined);
    setBusy(false);
    if (result.error || !result.data?.user) { dispatch(addToast({ message: result.error?.message || 'Unable to create account', type: 'error' })); return; }
    if (result.data.session) {
      dispatch(addToast({ message: 'Account created successfully. You are now signed in.', type: 'success' }));
      navigate('/', { replace: true });
    } else {
      dispatch(addToast({ message: 'Account created. If email confirmation is enabled in Supabase, confirm it before signing in.', type: 'success' }));
      navigate('/login', { replace: true });
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', type: 'text', icon: User, placeholder: 'Your full name' },
    { key: 'username', label: 'Username', type: 'text', icon: User, placeholder: 'your_username' },
    { key: 'email', label: 'Email', type: 'email', icon: Mail, placeholder: 'you@example.com' },
    { key: 'mobile', label: 'Mobile Number', type: 'tel', icon: Phone, placeholder: '+91 98765 43210' },
  ];

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
        <div className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><img src="/branding/stellar-logo.png" alt="Stellar Shop" className="h-12 w-12 rounded-2xl object-contain bg-black" /></div><h1 className="mt-4 text-2xl font-bold">Create your account</h1><p className="mt-1 text-sm text-muted">Create your account with your email and password.</p></div>

        {enabledSocialProviders.length > 0 && <div className="mt-6 grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" disabled={busy} onClick={() => void socialSignup('google')} className="w-full justify-center gap-2"><FaGoogle /> Google</Button>
        </div>}

        
        <form onSubmit={submit} className="mt-2 space-y-4">
          {fields.map(({ key, label, type, icon: Icon, placeholder }) => <div key={key}><label className="text-sm font-semibold">{label}</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><Icon className="h-4 w-4 text-muted" /><input value={(form as Record<string, string>)[key]} onChange={e => set(key, e.target.value)} required={key !== 'mobile'} type={type} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none" /></div></div>)}
          <div><label className="text-sm font-semibold">Password</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><Lock className="h-4 w-4 text-muted" /><input value={form.password} onChange={e => set('password', e.target.value)} required type={show ? 'text' : 'password'} placeholder="At least 8 characters" className="w-full bg-transparent text-sm outline-none" /><button type="button" onClick={() => setShow(!show)} className="text-muted">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
          <div><label className="text-sm font-semibold">Confirm Password</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><Lock className="h-4 w-4 text-muted" /><input value={form.confirm} onChange={e => set('confirm', e.target.value)} required type={show ? 'text' : 'password'} placeholder="Repeat your password" className="w-full bg-transparent text-sm outline-none" /></div></div>
          <label className="flex items-start gap-2 text-xs text-muted"><input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-0.5" /> I agree to the Terms and Privacy Policy.</label>
          <Turnstile onVerify={setCaptchaToken} />
          <Button type="submit" size="lg" loading={busy} className="w-full">Create account <ArrowRight className="h-4 w-4" /></Button>
        </form>
        <p className="mt-4 text-center text-xs text-muted">No OTP verification is used. Social sign-in providers are shown only after they are enabled in Supabase.</p>
        <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="font-semibold text-stellar-600 dark:text-stellar-300">Sign in</Link></p>
      </motion.div>
    </div>
  );
}
