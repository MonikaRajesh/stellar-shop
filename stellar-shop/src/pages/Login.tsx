import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/redux/store';
import { loginSuccess } from '@/redux/slices/authSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { isSupabaseConfigured } from '@/lib/supabase';
import { signInWithSupabase } from '@/services/auth';

export function Login() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [remember, setRemember] = useState(true);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSupabaseConfigured) {
      try {
        const data = await signInWithSupabase(emailOrMobile, password);
        const user = data?.user;
        if (!user) throw new Error('Sign in failed.');
        dispatch(loginSuccess({
          user: {
            id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'Stellar User',
            email: user.email || emailOrMobile,
            mobile: user.user_metadata?.mobile,
          },
          token: data.session?.access_token || '',
        }));
        dispatch(addToast({ message: 'Welcome back to Stellar Shop!', type: 'success' }));
        navigate('/');
      } catch (error: any) {
        dispatch(addToast({ message: error?.message || 'Invalid email or password.', type: 'error' }));
      }
      return;
    }

    const name = emailOrMobile.split('@')[0] || 'Stellar User';
    dispatch(loginSuccess({ user: { id: 'u1', name, email: emailOrMobile.includes('@') ? emailOrMobile : emailOrMobile + '@stellarshop.com' }, token: 'demo-token' }));
    dispatch(addToast({ message: 'Welcome back to Stellar Shop!', type: 'success' }));
    navigate('/');
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
        <div className="text-center">
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><Sparkles className="h-6 w-6" /></div>
          <h1 className="mt-4 text-2xl font-bold">Welcome back</h1>
          <p className="mt-1 text-sm text-muted">Sign in to your Stellar Shop account</p>
        </div>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold">Email or Mobile</label>
            <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3">
              <Mail className="h-4 w-4 text-muted" />
              <input value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} required type="text" placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Password</label>
            <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3">
              <Lock className="h-4 w-4 text-muted" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} required type={show ? 'text' : 'password'} placeholder="••••••••" className="w-full bg-transparent text-sm outline-none" />
              <button type="button" onClick={() => setShow((v) => !v)} className="text-muted hover:text-base">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="accent-stellar-500" /> Remember me</label>
            <Link to="/forgot-password" className="font-medium text-stellar-600 dark:text-stellar-300">Forgot password?</Link>
          </div>
          <Button type="submit" size="lg" className="w-full">Sign in <ArrowRight className="h-4 w-4" /></Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">{isSupabaseConfigured ? 'Secure authentication powered by Supabase.' : 'Demo mode — add Supabase environment variables for real authentication.'}</p>
        <p className="mt-4 text-center text-sm">New here? <Link to="/register" className="font-semibold text-stellar-600 dark:text-stellar-300">Create an account</Link></p>
      </motion.div>
    </div>
  );
}
