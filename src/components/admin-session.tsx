import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';
import { isApprovedEmail } from '@/lib/photo-rules';
const SessionContext = createContext({ admin: false, loading: true, error: '', refresh: async () => {} });
export const useAdminSession = () => useContext(SessionContext);
export function AdminSessionProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const queryClient = useQueryClient();
  const router = useRouter();
  async function refresh() {
    try {
      const { data, error: authError } = await supabase.auth.getUser();
      if (authError || !data.user) { setAdmin(false); return; }
      if (!isApprovedEmail(data.user.email)) { setAdmin(false); setError('Цей обліковий запис не має доступу адміністратора.'); return; }
      const userId = data.user.id;
      const { data: hasRole, error: roleError } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
      if (roleError) throw roleError;
      if (!hasRole) {
        const { error: claimError } = await supabase.from('user_roles').insert({ user_id: userId, role: 'admin' });
        if (claimError && claimError.code !== '23505') throw claimError;
      }
      const { data: verified, error: verifyError } = await supabase.rpc('has_role', { _user_id: userId, _role: 'admin' });
      if (verifyError) throw verifyError;
      setAdmin(verified === true); setError('');
    } catch { setAdmin(false); setError('Не вдалося перевірити доступ. Спробуйте повторити вхід.'); }
    finally { setLoading(false); }
  }
  useEffect(() => {
    void refresh();
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (!['SIGNED_IN', 'SIGNED_OUT', 'USER_UPDATED'].includes(event)) return;
      if (event === 'SIGNED_OUT') { setAdmin(false); queryClient.clear(); }
      setTimeout(() => { void refresh(); void router.invalidate(); if (event !== 'SIGNED_OUT') void queryClient.invalidateQueries(); }, 0);
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return <SessionContext.Provider value={{ admin, loading, error, refresh }}>{children}</SessionContext.Provider>;
}
