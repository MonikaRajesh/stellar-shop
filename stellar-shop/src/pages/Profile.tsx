import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { User, MapPin, CreditCard, Tag, Settings as SettingsIcon, Shield, Star, Bell, Pencil, Trash2, Plus, Save } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { updateProfile } from '@/redux/slices/authSlice';
import { addToast } from '@/redux/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { deleteSavedAddress, fetchSavedAddresses, saveAddress, updateMyProfile, type SavedAddress } from '@/services/supabase';

const nav = [
  ['overview','My Profile'], ['addresses','Saved Addresses'], ['payments','Payment Methods'], ['coupons','My Coupons'],
  ['reviews','My Reviews'], ['notifications','Notifications'], ['settings','Settings'], ['security','Security'],
] as const;

export function Profile() {
  const { section } = useParams();
  const user = useAppSelector((s) => s.auth.user);
  const key = nav.some(([k]) => k === section) ? section! : 'overview';
  if (!user) return <div className="mx-auto max-w-4xl px-4 py-20 text-center"><p className="text-muted">Please sign in.</p><Link to="/login"><Button className="mt-4">Sign in</Button></Link></div>;

  return <div className="mx-auto max-w-5xl px-4 py-6 lg:px-6">
    <div className="flex items-center gap-4 rounded-card border border-base bg-elevated p-5">
      <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-stellar text-2xl font-bold text-white">{user.name.charAt(0).toUpperCase()}</div>
      <div><h1 className="text-xl font-bold">{user.name}</h1><p className="text-sm text-muted">{user.email}</p></div>
    </div>
    <div className="mt-4 flex gap-2 overflow-x-auto pb-1 no-scrollbar">{nav.map(([k,title]) => <Link key={k} to={k==='overview'?'/profile':`/profile/${k}`} className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium ${key===k?'gradient-stellar text-white':'border border-base hover:bg-soft'}`}>{title}</Link>)}</div>
    <div className="mt-6 rounded-card border border-base bg-elevated p-5">
      {key==='overview' && <Overview user={user}/>} {key==='addresses' && <Addresses/>} {key==='settings' && <Settings user={user}/>} 
      {key==='payments' && <Placeholder title="Payment Methods" text="Razorpay handles payment details. No card numbers are stored in Stellar Shop."/>}
      {key==='coupons' && <Placeholder title="My Coupons" text="Your available coupons will appear here."/>}
      {key==='reviews' && <Placeholder title="My Reviews" text="You have not written any reviews yet."/>}
      {key==='notifications' && <Placeholder title="Notifications" text="Order updates and deal alerts will appear here."/>}
      {key==='security' && <Placeholder title="Security" text="Password and two-factor authentication are managed by Supabase Auth."/>}
    </div>
  </div>;
}

function Overview({user}:{user:{name:string;email:string}}){ return <><h2 className="text-lg font-bold">My Profile</h2><p className="mt-1 text-sm text-muted">Manage your account details and delivery information before checkout.</p><div className="mt-5 grid gap-3 sm:grid-cols-2"><Link to="/profile/addresses" className="flex items-center gap-3 rounded-xl border border-base p-4"><MapPin className="h-5 w-5 text-stellar-500"/><span className="text-sm font-semibold">Edit saved addresses</span></Link><Link to="/profile/settings" className="flex items-center gap-3 rounded-xl border border-base p-4"><SettingsIcon className="h-5 w-5 text-stellar-500"/><span className="text-sm font-semibold">Account settings</span></Link></div></>; }

function Settings({user}:{user:{id:string;name:string;email:string;mobile?:string;address?:string}}){
  const dispatch=useAppDispatch(); const [name,setName]=useState(user.name); const [mobile,setMobile]=useState(user.mobile||''); const [address,setAddress]=useState(user.address||''); const [username,setUsername]=useState(''); const [busy,setBusy]=useState(false);
  const save=async()=>{setBusy(true); const r=await updateMyProfile({name:name.trim(),mobile:mobile.trim(),address:address.trim(),username:username.trim()||undefined}); setBusy(false); if(r.error){dispatch(addToast({message:r.error.message,type:'error'}));return;} dispatch(updateProfile({name:name.trim(),mobile:mobile.trim(),address:address.trim()})); dispatch(addToast({message:'Settings saved successfully.',type:'success'}));};
  return <><h2 className="text-lg font-bold">Settings</h2><p className="mt-1 text-sm text-muted">Edit your profile and delivery contact information here. You do not need to wait until an order is delivered.</p><div className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Full name" value={name} onChange={setName}/><Field label="Mobile number" value={mobile} onChange={setMobile}/><Field label="Username (optional)" value={username} onChange={setUsername}/><div className="rounded-xl border border-base bg-soft p-4"><p className="text-xs text-muted">Email</p><p className="mt-1 text-sm font-semibold">{user.email}</p><p className="mt-1 text-xs text-muted">Email is managed by Supabase Auth.</p></div></div><div className="mt-4"><Field label="Default delivery address" value={address} onChange={setAddress}/><p className="mt-1 text-xs text-muted">This address is editable from Settings and is used as your default delivery contact.</p></div><Button className="mt-5" loading={busy} onClick={()=>void save()}><Save className="h-4 w-4"/> Save settings</Button></>;
}

function Addresses(){
  const dispatch=useAppDispatch(); const [items,setItems]=useState<SavedAddress[]>([]); const [label,setLabel]=useState('Home'); const [address,setAddress]=useState(''); const [phone,setPhone]=useState(''); const [editing,setEditing]=useState<string|null>(null); const [busy,setBusy]=useState(false);
  const load=async()=>{const r=await fetchSavedAddresses(); if(!r.error)setItems(r.data);}; useEffect(()=>{void load();},[]);
  const reset=()=>{setEditing(null);setLabel('Home');setAddress('');setPhone('');};
  const edit=(a:SavedAddress)=>{setEditing(a.id);setLabel(a.label);setAddress(a.full_address);setPhone(a.phone||'');};
  const save=async()=>{if(address.trim().length<10){dispatch(addToast({message:'Enter a complete address.',type:'error'}));return;} setBusy(true); const r=await saveAddress({label:label.trim()||'Home',full_address:address.trim(),phone:phone.trim(),is_default: editing ? Boolean(items.find((x)=>x.id===editing)?.is_default) : items.length===0},editing||undefined); setBusy(false); if(r.error){dispatch(addToast({message:r.error.message,type:'error'}));return;} dispatch(addToast({message:'Address saved.',type:'success'})); reset(); await load();};
  const remove=async(id:string)=>{const r=await deleteSavedAddress(id); if(r.error){dispatch(addToast({message:r.error.message,type:'error'}));return;} await load();};
  return <><div className="flex items-center justify-between gap-3"><div><h2 className="text-lg font-bold">Saved Addresses</h2><p className="mt-1 text-sm text-muted">Add or edit addresses before placing an order.</p></div><Button size="sm" variant="outline" onClick={reset}><Plus className="h-4 w-4"/> New</Button></div><div className="mt-5 grid gap-3 md:grid-cols-2">{items.map(a=><div key={a.id} className="rounded-xl border border-base p-4"><div className="flex items-center justify-between"><div><span className="font-bold">{a.label}</span>{a.is_default&&<span className="ml-2 rounded-full bg-success-500/10 px-2 py-0.5 text-xs text-success-500">Default</span>}</div><div className="flex gap-1"><button onClick={()=>edit(a)} className="rounded-lg p-2 hover:bg-soft" aria-label="Edit address"><Pencil className="h-4 w-4"/></button><button onClick={()=>void remove(a.id)} className="rounded-lg p-2 text-error-500 hover:bg-soft" aria-label="Delete address"><Trash2 className="h-4 w-4"/></button></div></div><p className="mt-2 text-sm text-muted">{a.full_address}</p>{a.phone&&<p className="mt-1 text-xs text-muted">{a.phone}</p>}</div>)}{items.length===0&&<div className="rounded-xl border border-dashed border-base p-6 text-sm text-muted">No saved address yet. Add one below.</div>}</div><div className="mt-5 rounded-xl border border-base p-4"><h3 className="font-semibold">{editing?'Edit address':'Add address'}</h3><div className="mt-3 grid gap-3 md:grid-cols-3"><Field label="Label" value={label} onChange={setLabel}/><Field label="Phone" value={phone} onChange={setPhone}/><div className="md:col-span-3"><Field label="Full address" value={address} onChange={setAddress}/></div></div><div className="mt-4 flex gap-2"><Button loading={busy} onClick={()=>void save()}>Save address</Button>{editing&&<Button variant="outline" onClick={reset}>Cancel</Button>}</div></div></>;
}

function Field({label,value,onChange}:{label:string;value:string;onChange:(v:string)=>void}){return <label className="block"><span className="text-xs font-semibold text-muted">{label}</span><input value={value} onChange={e=>onChange(e.target.value)} className="mt-1.5 h-11 w-full rounded-xl border border-base bg-transparent px-3 text-sm outline-none focus:border-stellar-400"/></label>}
function Placeholder({title,text}:{title:string;text:string}){return <><h2 className="text-lg font-bold">{title}</h2><p className="mt-2 text-sm text-muted">{text}</p></>}
