import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldCheck, Eye, EyeOff, ArrowRight, UserRound } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { useAppDispatch } from '@/redux/store';
import { addToast } from '@/redux/slices/uiSlice';
import { resolveAdminIdentifier, signInWithSupabase, isCurrentUserAdmin, signOutSupabase, bootstrapConfiguredAdmin } from '@/services/supabase';
import { supabaseEnabled } from '@/lib/supabase';
import { setAdminSessionHint } from '@/admin-session';

export function AdminLogin() {
  const navigate = useNavigate(); const dispatch = useAppDispatch();
  const [userId,setUserId]=useState('chinmayms12'); const [password,setPassword]=useState(''); const [show,setShow]=useState(false); const [busy,setBusy]=useState(false);
  const submit=async(e:React.FormEvent)=>{e.preventDefault();setBusy(true);
    try {
      if(!supabaseEnabled){dispatch(addToast({message:'Supabase is not configured for this deployment.',type:'error'}));return;}
      const resolved=await resolveAdminIdentifier(userId);
      if(resolved.error || !resolved.email){dispatch(addToast({message:resolved.error?.message || 'Administrator account not found.',type:'error'}));return;}
      const result=await signInWithSupabase(resolved.email,password);
      if(result.error){dispatch(addToast({message:String(result.error.message || 'Invalid administrator password.'),type:'error'}));return;}
      // Authentication is complete. Do not query or mutate public.profiles here;
      // the administrator account is authorized by the configured Auth email.
      const bootstrap = await bootstrapConfiguredAdmin();
      if (!bootstrap.ok) {
        await signOutSupabase();
        dispatch(addToast({message:bootstrap.error?.message || 'The authenticated account is not the configured administrator account.',type:'error'}));
        return;
      }
      const admin=await isCurrentUserAdmin();
      if(admin){setAdminSessionHint(true);dispatch(addToast({message:'Admin login successful.',type:'success'}));navigate('/admin',{replace:true});return;}
      await signOutSupabase();
      dispatch(addToast({message:'Authentication succeeded, but the administrator profile could not be authorized. Please verify the Supabase profile exists for this account.',type:'error'}));
    } catch (error) {
      const message = error instanceof Error ? error.message : String((error as any)?.message || error || 'Administrator login failed.');
      dispatch(addToast({message:message === '[object Object]' ? 'Administrator login failed. Check the Supabase Auth account and admin profile role.' : message,type:'error'}));
    } finally {
      setBusy(false);
    }
  };
  return <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6"><motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
    <div className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><ShieldCheck className="h-6 w-6"/></div><h1 className="mt-4 text-2xl font-bold">Admin Dashboard</h1><p className="mt-1 text-sm text-muted">Enter your administrator User ID or email and password.</p></div>
    <form onSubmit={submit} className="mt-6 space-y-4">
      <div><label className="text-sm font-semibold">Admin User ID or Email</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><UserRound className="h-4 w-4 text-muted"/><input value={userId} onChange={e=>setUserId(e.target.value)} required autoComplete="username" type="text" placeholder="admin or admin@example.com" className="w-full bg-transparent text-sm outline-none"/></div></div>
      <div><label className="text-sm font-semibold">Password</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><LockKeyhole className="h-4 w-4 text-muted"/><input value={password} onChange={e=>setPassword(e.target.value)} required autoComplete="current-password" type={show?'text':'password'} placeholder="Admin password" className="w-full bg-transparent text-sm outline-none"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-muted" aria-label="Show password">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
      <Button type="submit" size="lg" loading={busy} className="w-full">Open dashboard <ArrowRight className="h-4 w-4"/></Button>
    </form><div className="mt-5 rounded-xl bg-soft p-3 text-xs text-muted"><p className="font-semibold text-base">Secure administrator login</p><p className="mt-1">Administrator credentials are never displayed on this page.</p></div>
    <p className="mt-5 text-center text-sm"><Link to="/login" className="font-semibold text-stellar-600 dark:text-stellar-300">Back to customer login</Link></p>
  </motion.div></div>;
}
