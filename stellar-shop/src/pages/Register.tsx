import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, Sparkles, ArrowRight } from 'lucide-react';
import { useAppDispatch } from '@/redux/store';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { signUpWithSupabase } from '@/services/supabase';
import { supabaseEnabled } from '@/lib/supabase';
import { Turnstile } from '@/components/auth/Turnstile';

export function Register() {
  const dispatch=useAppDispatch(); const navigate=useNavigate();
  const [form,setForm]=useState({name:'',username:'',email:'',mobile:'',password:'',confirm:''});
  const [show,setShow]=useState(false); const [terms,setTerms]=useState(false); const [busy,setBusy]=useState(false); const [captchaToken,setCaptchaToken]=useState('');
  const set=(k:string,v:string)=>setForm(f=>({...f,[k]:v}));
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();
    if(!supabaseEnabled){dispatch(addToast({message:'Authentication is not configured. Add Supabase environment variables first.',type:'error'}));return;}
    if(form.password!==form.confirm){dispatch(addToast({message:'Passwords do not match',type:'error'}));return;}
    if(form.password.length<8){dispatch(addToast({message:'Password must be at least 8 characters.',type:'error'}));return;}
    setBusy(true); const result=await signUpWithSupabase(form.email.trim(),form.password,{name:form.name.trim(),mobile:form.mobile.trim(),username:form.username.trim()},captchaToken||undefined); setBusy(false);
    if(result.error||!result.data?.user){dispatch(addToast({message:result.error?.message||'Unable to create account',type:'error'}));return;}
    if(result.data?.session){ dispatch(addToast({message:'Account created successfully. You are now signed in.',type:'success'})); navigate('/',{replace:true}); } else { dispatch(addToast({message:'Account created successfully. You can sign in now.',type:'success'})); navigate('/login',{replace:true}); }
  };
  const fields=[{key:'name',label:'Full Name',type:'text',icon:User,placeholder:'Your full name'},{key:'username',label:'Username',type:'text',icon:User,placeholder:'your_username'},{key:'email',label:'Email',type:'email',icon:Mail,placeholder:'you@example.com'},{key:'mobile',label:'Mobile Number',type:'tel',icon:Phone,placeholder:'+91 98765 43210'}];
  return <div className="mx-auto flex max-w-md flex-col px-4 py-12 lg:px-6"><motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} className="rounded-card border border-base bg-elevated p-8 shadow-soft">
    <div className="text-center"><div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl gradient-stellar text-white"><Sparkles className="h-6 w-6"/></div><h1 className="mt-4 text-2xl font-bold">Create your account</h1><p className="mt-1 text-sm text-muted">Create your account and start shopping immediately.</p></div>
    <form onSubmit={submit} className="mt-6 space-y-4">
      {fields.map(f=><div key={f.key}><label className="text-sm font-semibold">{f.label}</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><f.icon className="h-4 w-4 text-muted"/><input value={form[f.key as keyof typeof form]} onChange={e=>set(f.key,e.target.value)} required={f.key!=='username'} type={f.type} placeholder={f.placeholder} className="w-full bg-transparent text-sm outline-none"/></div></div>)}
      <div><label className="text-sm font-semibold">Password</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><Lock className="h-4 w-4 text-muted"/><input value={form.password} onChange={e=>set('password',e.target.value)} required minLength={8} type={show?'text':'password'} placeholder="At least 8 characters" className="w-full bg-transparent text-sm outline-none"/><button type="button" onClick={()=>setShow(v=>!v)} className="text-muted">{show?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button></div></div>
      <div><label className="text-sm font-semibold">Confirm Password</label><div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-base px-3"><Lock className="h-4 w-4 text-muted"/><input value={form.confirm} onChange={e=>set('confirm',e.target.value)} required type={show?'text':'password'} placeholder="Repeat password" className="w-full bg-transparent text-sm outline-none"/></div></div>
      <Turnstile onVerify={setCaptchaToken}/>
      <label className="flex items-start gap-2 text-sm"><input type="checkbox" checked={terms} onChange={e=>setTerms(e.target.checked)} required className="mt-0.5 accent-stellar-500"/><span className="text-muted">I agree to the <Link to="/terms" className="font-medium text-stellar-600 dark:text-stellar-300">Terms & Conditions</Link> and <Link to="/privacy" className="font-medium text-stellar-600 dark:text-stellar-300">Privacy Policy</Link></span></label>
      <Button type="submit" size="lg" disabled={!terms} loading={busy} className="w-full">Create account <ArrowRight className="h-4 w-4"/></Button>
    </form>
    <p className="mt-4 text-center text-sm text-muted">No email OTP or verification step is required.</p>
    <p className="mt-4 text-center text-sm">Already have an account? <Link to="/login" className="font-semibold text-stellar-600 dark:text-stellar-300">Sign in</Link></p>
  </motion.div></div>;
}
