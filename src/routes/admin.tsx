import { createFileRoute, Link } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_EMAIL } from '@/lib/photo-rules';
import { useAdminSession } from '@/components/admin-session';

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Вхід адміністратора — ЗДО № 701" },
      { name: "description", content: "Захищений вхід адміністратора сайту ЗДО № 701." },
      { property: "og:title", content: "Вхід адміністратора — ЗДО № 701" },
      { property: "og:description", content: "Захищений вхід адміністратора сайту ЗДО № 701." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { admin, loading, error: accessError } = useAdminSession();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [sent, setSent] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function sendLink(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) { setMessage("Вхід дозволено лише адміністратору закладу."); return; }
    setBusy(true); setMessage("");
    const { error } = await supabase.auth.signInWithOtp({ email: ADMIN_EMAIL, options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/` } });
    setBusy(false);
    if (error) { setMessage("Не вдалося надіслати лист. Спробуйте ще раз за хвилину."); return; }
    setSent(true);
  }

  if (loading) return <main className="mx-auto max-w-6xl px-4 py-12" role="status">Перевіряємо вхід…</main>;
  if (admin) return <main className="mx-auto max-w-xl px-4 py-12 text-center">
    <h1 className="font-display text-3xl text-primary-deep">Ви увійшли як адміністратор</h1>
    <p className="mt-3 text-muted-foreground">Керування фото та колективом доступне прямо на сторінках сайту.</p>
    <Button asChild className="mt-6"><Link to="/">Перейти на сайт</Link></Button>
  </main>;

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <section className="p-6 toy-card sm:p-8">
        <h1 className="font-display text-3xl text-primary-deep">Вхід адміністратора</h1>
        {!sent ? <form className="mt-7 space-y-4" onSubmit={sendLink}>
          <div className="space-y-2">
            <Label htmlFor="admin-email">Електронна пошта</Label>
            <Input id="admin-email" type="email" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
          </div>
          <Button type="submit" disabled={busy} className="w-full font-display font-bold">{busy ? "Надсилаємо…" : "Надіслати посилання для входу"}</Button>
        </form> : <div className="mt-6 space-y-4">
          <p>Лист надіслано на {ADMIN_EMAIL}. Відкрийте його та натисніть посилання — сайт відкриється вже з режимом адміністратора.</p>
          <Button variant="outline" className="w-full" onClick={() => setSent(false)}>Надіслати ще раз</Button>
        </div>}
        {accessError && <p className="mt-5 text-destructive" role="alert">{accessError}</p>}
        {message && <p className="mt-5 text-sm text-destructive" role="status">{message}</p>}
      </section>
    </main>
  );
}
