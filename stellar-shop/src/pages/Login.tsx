import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Phone, Sparkles, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { useAppDispatch } from '@/redux/store';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { sendLoginOtp, verifyLoginOtp } from '@/services/supabase';
import { supabaseEnabled } from '@/lib/supabase';
import { Turnstile } from '@/components/auth/Turnstile';

const COOLDOWN_SECONDS = 60;

export function Login() {
  const dispatch = useAppDispatch(); const navigate = useNavigate(); const location = useLocation();
  const [mode, setMode] = useState<'email' | 'phone'>('email');
  const [identifier, setIdentifier] = useState(''); const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'identifier' | 'otp'>('identifier');
  const [busy, setBusy] = useState(false); const [cooldown, setCooldown] = useState(0); const [captchaToken, setCaptchaToken] = useState('');

  const startCooldown = () => {
    setCooldown(COOLDOWN_SECONDS);
    const started = Date.now();
    const timer = window.setInterval(() => {
      const remaining = Math.max(0, COOLDOWN_SECONDS - Math.floor((Date.now() - started) / 1000));
      setCooldown(remaining);
      if (!remaining) window.clearInterval(timer);
    }, 1000);
  };

  const sendCode = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!supabaseEnabled) { dispatch(addToast({ message: 'Authentication is not configured. Add Supabase environment variables first.', type: 'error' })); return; }
    if (cooldown > 0) return;
    const value = identifier.trim();
    if (mode === 'email' && !/^\S+@\S+\.\S+$/.test(value)) { dispatch(addToast({ message: 'Enter a valid email address.', type: 'error' })); return; }
    if (mode === 'phone' && !/^\+?[1-9]\d{7,14}$/.test(value.replace(/[\s()-]/g, ''))) { dispatch(addToast({ message: 'Enter the phone number in international format, for example +919876543210.', type: 'error' })); return; }
    setBusy(true);
    const result = await sendLoginOtp(value, mode, captchaToken || undefined);
    setBusy(false);
    if (result.error) { dispatch(addToast({ message: result.error.message || 'Unable to send OTP.', type: 'error' })); return; }
    setStep('otp'); startCooldown();
    dispatch(addToast({ message: `A one-time code was sent to your ${mode === 'email' ? 'email' : 'phone'}.`, type: 'success' }));
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(otp.trim())) { dispatch(addToast({ message: 'Enter the 6-digit OTP.', type: 'error' })); return; }
    setBusy(true); const result = await verifyLoginOtp(identifier, otp, mode); setBusy(false);
    if (result.error || !result.data?.session) { dispatch(addToast({ message: result.error?.message || 'Invalid or expired OTP.', type: 'error' })); return; }
    dispatch(addToast({ message: 'OTP verified. Welcome back to Stellar Shop!', type: 'success' }));
    navigate((location.state as { from?: string } | null)?.from || '/', { replace: true });
  };

  return <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6"><motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
    <div className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><Sparkles className="h-6 w-6"/></div><h1 className="mt-4 text-2xl font-bold">Secure sign in</h1><p className="mt-1 text-sm text-muted">Use a one-time password to sign in to your existing account.</p></div>
    {step === 'identifier' ? <form onSubmit={sendCode} className="mt-6 space-y-4">
      <div className="grid grid-cols-2 gap-2 rounded-xl bg-soft p-1"><button type="button" onClick={()=>setMode('email')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode==='email'?'bg-elevated shadow-sm':''}`}><Mail className="mr-1 inline h-4 w-4"/> Email</button><button type="button" onClick={()=>setMode('phone')} className={`rounded-lg px-3 py-2 text-sm font-semibold ${mode==='phone'?'bg-elevated shadow-sm':''}`}><Phone className="mr-1 inline h-4 w-4"/> Phone</button></div>
      <div><label className="text-sm font-semibold">{mode === 'email' ? 'Email address' : 'Phone number'}</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3">{mode==='email'?<Mail className="h-4 w-4 text-muted"/>:<Phone className="h-4 w-4 text-muted"/>}<input value={identifier} onChange={e=>setIdentifier(e.target.value)} required type={mode==='email'?'email':'tel'} autoComplete={mode==='email'?'email':'tel'} placeholder={mode==='email'?'you@example.com':'+91 98765 43210'} className="w-full bg-transparent text-sm outline-none"/></div></div>
      <Turnstile onVerify={setCaptchaToken}/>
      <Button type="submit" size="lg" loading={busy} disabled={cooldown>0} className="w-full">{cooldown>0?`Wait ${cooldown}s`:'Send OTP'} <ArrowRight className="h-4 w-4"/></Button>
      {mode === 'phone' && <p className="rounded-xl bg-soft p-3 text-xs text-muted">Phone OTP requires an SMS provider (such as Twilio, Vonage, or MessageBird) to be enabled in Supabase.</p>}
    </form> : <form onSubmit={verifyCode} className="mt-6 space-y-4">
      <div className="rounded-xl bg-soft p-3 text-sm">Code sent to <strong>{identifier}</strong></div>
      <div><label className="text-sm font-semibold">6-digit OTP</label><input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} inputMode="numeric" autoComplete="one-time-code" maxLength={6} autoFocus placeholder="123456" className="mt-1.5 h-12 w-full rounded-xl border border-base bg-transparent px-4 text-center text-xl font-bold tracking-[0.5em] outline-none focus:border-stellar-400"/></div>
      <Button type="submit" size="lg" loading={busy} className="w-full">Verify and sign in <ShieldCheck className="h-4 w-4"/></Button>
      <div className="flex items-center justify-between text-sm"><button type="button" disabled={cooldown>0||busy} onClick={()=>void sendCode()} className="font-semibold text-stellar-600 disabled:opacity-50 dark:text-stellar-300"><RefreshCw className="mr-1 inline h-4 w-4"/>{cooldown>0?`Resend in ${cooldown}s`:'Resend OTP'}</button><button type="button" onClick={()=>{setStep('identifier');setOtp('');}} className="font-semibold text-muted">Change {mode}</button></div>
    </form>}
    <div className="mt-5 rounded-xl bg-soft p-3 text-xs text-muted"><p className="flex items-center gap-2 font-semibold text-base"><ShieldCheck className="h-4 w-4"/> OTP-protected login</p><p className="mt-1">OTP sign-in is restricted to existing accounts, so an unknown identifier cannot silently create a customer account.</p></div>
    <p className="mt-4 text-center text-sm">Admin? <Link to="/admin-login" className="font-semibold text-stellar-600 dark:text-stellar-300">Admin login</Link></p>
    <p className="mt-4 text-center text-sm">New here? <Link to="/register" className="font-semibold text-stellar-600 dark:text-stellar-300">Create an account</Link></p>
  </motion.div></div>;
}
