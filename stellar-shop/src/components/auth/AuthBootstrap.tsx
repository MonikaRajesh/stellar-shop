import { useEffect } from 'react';
import { useAppDispatch } from '@/redux/store';
import { loginSuccess, logout } from '@/redux/slices/authSlice';
import { supabase, supabaseEnabled } from '@/lib/supabase';
import { fetchCurrentProfile, touchUserActivity } from '@/services/supabase';

export function AuthBootstrap() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!supabaseEnabled || !supabase) { dispatch(logout()); return; }
    let mounted = true;
    let firstSessionSync = true;
    const sync = async (session: any) => {
      if (!mounted) return;
      if (!session?.user) { dispatch(logout()); return; }
      const u = session.user;
      const { data: profile } = await fetchCurrentProfile(u.id);
      if (!mounted) return;
      dispatch(loginSuccess({
        user: {
          id: u.id,
          name: profile?.name || u.user_metadata?.name || u.email?.split('@')[0] || 'Stellar User',
          email: u.email || profile?.email || '',
          mobile: profile?.mobile || u.user_metadata?.mobile,
          address: profile?.address || '',
        },
        token: session.access_token,
      }));
      void touchUserActivity(u.id, firstSessionSync);
      firstSessionSync = false;
    };
    supabase.auth.getSession().then(({ data }) => sync(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => { void sync(session); });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, [dispatch]);
  return null;
}
