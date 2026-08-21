import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAppDispatch } from '@/redux/store';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { signInWithSupabase } from '@/services/supabase';
import { supabaseEnabled } from '@/lib/supabase';
import { Turnstile } from '@/components/auth/Turnstile';

export function Login() {
  const dispatch = useAppDispatch(); const navigate = useNavigate(); const location = useLocation();
  const [email, setEmail] = useState(''); const [password, setPassword] = useState('');
  const [show, setShow] = useState(false); const [busy, setBusy] = useState(false); const [captchaToken, setCaptchaToken] = useState('');
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabaseEnabled) { dispatch(addToast({ message: 'Authentication is not configured. Add Supabase environment variables first.', type: 'error' })); return; }
    setBusy(true); const result = await signInWithSupabase(email.trim(), password, captchaToken || undefined); setBusy(false);
    if (result.error || !result.data?.session) { dispatch(addToast({ message: result.error?.message || 'Unable to sign in. Verify your email and password.', type: 'error' })); return; }
    dispatch(addToast({ message: 'Welcome back to Stellar Shop!', type: 'success' }));
    navigate((location.state as { from?: string } | null)?.from || '/', { replace: true });
  };
  return <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6"><motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
    <div className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><Sparkles className="h-6 w-6"/></div><h1 className="mt-4 text-2xl font-bold">Welcome back</h1><p className="mt-1 text-sm text-muted">Sign in securely to your Stellar Shop account</p></div>
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div><label className="text-sm font-semibold">Email</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><Mail className="h-4 w-4 text-muted"/><input value={email} onChange={e=>setEmail(e.target.value)} required type="email" autoComplete="email" placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none"/></div></div>
      <div><label className="text-sm font-semibold">Password</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><Lock className="h-4 w-4 text-muted"/><input value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} autoComplete="current-password" type={show?'text':'password'} placeholder="••••••••" className="w-full bg-transparent text-sm outline-none"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-muted">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
      <div className="flex justify-end text-sm"><Link to="/forgot-password" className="font-medium text-stellar-600 dark:text-stellar-300">Forgot password?</Link></div>
      <Turnstile onVerify={setCaptchaToken}/>
      <Button type="submit" size="lg" loading={busy} className="w-full">Sign in <ArrowRight className="h-4 w-4"/></Button>
    </form>
    <div className="mt-5 rounded-xl bg-soft p-3 text-xs text-muted"><p className="flex items-center gap-2 font-semibold text-base"><ShieldCheck className="h-4 w-4"/> Secure authentication</p><p className="mt-1">Authentication is handled by Supabase Auth. Turnstile can block automated login attempts.</p></div>
    <p className="mt-4 text-center text-sm">Admin? <Link to="/admin-login" className="font-semibold text-stellar-600 dark:text-stellar-300">Admin login</Link></p>
    <p className="mt-4 text-center text-sm">New here? <Link to="/register" className="font-semibold text-stellar-600 dark:text-stellar-300">Create an account</Link></p>
  </motion.div></div>;
}
