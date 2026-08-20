import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MailCheck, RefreshCw, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { addToast } from '@/redux/slices/uiSlice';
import { useAppDispatch } from '@/redux/store';
import { resendSignupOtp, verifySignupOtp } from '@/services/supabase';
import { supabase, supabaseEnabled } from '@/lib/supabase';

export function VerifyEmail() {
  const [params]=useSearchParams(); const navigate=useNavigate(); const dispatch=useAppDispatch();
  const [email,setEmail]=useState(params.get('email')||''); const [token,setToken]=useState(''); const [busy,setBusy]=useState(false); const [resending,setResending]=useState(false);
  const storageKey=useMemo(()=>`stellar-otp-resend:${email.trim().toLowerCase()}`,[email]);
  const [cooldownUntil,setCooldownUntil]=useState<number>(()=>{const v=Number(localStorage.getItem(`stellar-otp-resend:${(params.get('email')||'').trim().toLowerCase()}`)||0);return Number.isFinite(v)?v:0;});
  const [now,setNow]=useState(Date.now());
  const secondsLeft=Math.max(0,Math.ceil((cooldownUntil-now)/1000));
  useEffect(()=>{if(!cooldownUntil||secondsLeft<=0)return;const id=window.setInterval(()=>setNow(Date.now()),1000);return()=>window.clearInterval(id);},[cooldownUntil,secondsLeft]);
  useEffect(()=>{const v=Number(localStorage.getItem(storageKey)||0);setCooldownUntil(Number.isFinite(v)?v:0);},[storageKey]);
  useEffect(() => { let active = true; if (!supabase) return; supabase.auth.getSession().then(({ data }) => { if (active && data.session?.user) { dispatch(addToast({message:'Email verified successfully. Your account is ready.',type:'success'})); navigate('/', { replace: true }); } }); return () => { active = false; }; }, [dispatch, navigate]);
  const verify=async(e:React.FormEvent)=>{e.preventDefault();if(!supabaseEnabled)return;setBusy(true);const r=await verifySignupOtp(email.trim(),token.trim());setBusy(false);if(r.error||!r.data?.session){dispatch(addToast({message:r.error?.message||'Invalid or expired OTP.',type:'error'}));return;}localStorage.removeItem(storageKey);dispatch(addToast({message:'Email verified. Your account is ready.',type:'success'}));navigate('/',{replace:true});};
  const resend=async()=>{if(!email.trim()||secondsLeft>0||resending)return;setResending(true);const r=await resendSignupOtp(email.trim());setResending(false);if(!r.error){const next=Date.now()+60000;localStorage.setItem(storageKey,String(next));setCooldownUntil(next);setNow(Date.now());dispatch(addToast({message:'A new verification email has been sent. Check spam/junk too.',type:'success'}));return;}const msg=String(r.error.message||'Unable to resend verification email.');const rateLimited=/rate.?limit|too many|email.*exceed/i.test(msg);dispatch(addToast({message:rateLimited?'Email sending is temporarily rate-limited by Supabase. Please wait before trying again.':msg,type:'error'}));};
  return <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6"><motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
    <div className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><MailCheck className="h-6 w-6"/></div><h1 className="mt-4 text-2xl font-bold">Verify your email</h1><p className="mt-2 text-sm text-muted">Enter the 6-digit code sent to your email.</p></div>
    <form onSubmit={verify} className="mt-6 space-y-4"><input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="you@example.com" className="h-11 w-full rounded-xl border border-base bg-transparent px-3 text-sm outline-none"/><input value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,'').slice(0,6))} required inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" placeholder="6-digit OTP" className="h-12 w-full rounded-xl border border-base bg-transparent px-4 text-center text-lg tracking-[0.45em] outline-none"/><Button type="submit" size="lg" loading={busy} className="w-full">Verify email <ArrowRight className="h-4 w-4"/></Button></form>
    <button onClick={resend} disabled={resending||secondsLeft>0} className="mx-auto mt-4 flex items-center gap-2 text-sm font-semibold text-stellar-600 dark:text-stellar-300 disabled:opacity-50"><RefreshCw className="h-4 w-4"/>{resending?'Sending…':secondsLeft>0?`Resend available in ${secondsLeft}s`:'Resend code'}</button>
    <p className="mt-5 text-center text-sm text-muted">Already verified? <Link to="/login" className="font-semibold text-stellar-600 dark:text-stellar-300">Sign in</Link></p>
  </motion.div></div>;
}
