import { LogOut } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { useAdminSession } from './admin-session';
import { supabase } from '@/integrations/supabase/client';

export function AdminBar() {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  if (!admin) return null;
  async function signOut() { await queryClient.cancelQueries(); queryClient.clear(); await supabase.auth.signOut(); }
  return <div className="border-b border-primary-deep bg-secondary">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-2 text-sm sm:px-6">
      <span className="font-display font-bold text-primary-deep">Режим адміністратора</span>
      <span className="text-muted-foreground">Додавайте, видаляйте та перетягуйте фото прямо на сторінках.</span>
      <div className="ml-auto flex gap-2">
        <Button size="sm" variant="outline" onClick={() => void signOut()}><LogOut />Вийти</Button>
      </div>
    </div>
  </div>;
}