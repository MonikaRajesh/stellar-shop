import { useEffect, useState } from 'react';
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
  useEffect(() => { let active = true; if (!supabase) return; supabase.auth.getSession().then(({ data }) => { if (active && data.session?.user) { dispatch(addToast({message:'Email verified successfully. Your account is ready.',type:'success'})); navigate('/', { replace: true }); } }); return () => { active = false; }; }, [dispatch, navigate]);
  const verify=async(e:React.FormEvent)=>{e.preventDefault();if(!supabaseEnabled)return;setBusy(true);const r=await verifySignupOtp(email.trim(),token.trim());setBusy(false);if(r.error||!r.data?.session){dispatch(addToast({message:r.error?.message||'Invalid or expired OTP.',type:'error'}));return;}dispatch(addToast({message:'Email verified. Your account is ready.',type:'success'}));navigate('/',{replace:true});};
  const resend=async()=>{if(!email.trim())return;setResending(true);const r=await resendSignupOtp(email.trim());setResending(false);dispatch(addToast({message:r.error?r.error.message:'A new verification email has been sent.',type:r.error?'error':'success'}));};
  return <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6"><motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
    <div className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><MailCheck className="h-6 w-6"/></div><h1 className="mt-4 text-2xl font-bold">Verify your email</h1><p className="mt-2 text-sm text-muted">Enter the 6-digit code sent to your email.</p></div>
    <form onSubmit={verify} className="mt-6 space-y-4"><input value={email} onChange={e=>setEmail(e.target.value)} required type="email" placeholder="you@example.com" className="h-11 w-full rounded-xl border border-base bg-transparent px-3 text-sm outline-none"/><input value={token} onChange={e=>setToken(e.target.value.replace(/\D/g,'').slice(0,6))} required inputMode="numeric" autoComplete="one-time-code" pattern="\d{6}" placeholder="6-digit OTP" className="h-12 w-full rounded-xl border border-base bg-transparent px-4 text-center text-lg tracking-[0.45em] outline-none"/><Button type="submit" size="lg" loading={busy} className="w-full">Verify email <ArrowRight className="h-4 w-4"/></Button></form>
    <button onClick={resend} disabled={resending} className="mx-auto mt-4 flex items-center gap-2 text-sm font-semibold text-stellar-600 dark:text-stellar-300 disabled:opacity-50"><RefreshCw className="h-4 w-4"/>{resending?'Sending…':'Resend code'}</button>
    <p className="mt-5 text-center text-sm text-muted">Already verified? <Link to="/login" className="font-semibold text-stellar-600 dark:text-stellar-300">Sign in</Link></p>
  </motion.div></div>;
}
