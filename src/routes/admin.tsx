import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

import { ADMIN_EMAIL } from '@/lib/photo-rules';
import { useAdminSession } from '@/components/admin-session';
import { AdminDashboard } from '@/components/admin-dashboard';

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
  const { admin, loading, error: accessError, refresh } = useAdminSession();
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (email.trim().toLowerCase() !== ADMIN_EMAIL) {
      setMessage("Вхід дозволено лише адміністратору закладу.");
      return;
    }

    setBusy(true);
    setMessage("");
    const { error } = await supabase.auth.signInWithOtp({
      email: ADMIN_EMAIL,
      options: { shouldCreateUser: true, emailRedirectTo: `${window.location.origin}/admin` },
    });
    setBusy(false);

    if (error) {
      setMessage("Не вдалося надіслати код. Спробуйте ще раз.");
      return;
    }

    setCodeSent(true);
    setMessage("Лист надіслано. Натисніть посилання в листі або введіть код, якщо він указаний.");
  }

  async function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const { data, error } = await supabase.auth.verifyOtp({
      email: ADMIN_EMAIL,
      token: code.trim(),
      type: "email",
    });

    if (error || !data.user) {
      setBusy(false);
      setMessage("Код неправильний або вже недійсний.");
      return;
    }

    await refresh();
    setBusy(false);
  }

  if (loading) return <main className="mx-auto max-w-6xl px-4 py-12" role="status">Перевіряємо вхід…</main>;
  if (admin) return <AdminDashboard />;

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <section className="p-6 toy-card sm:p-8">
        <p className="font-display text-sm font-bold text-accent">Захищена сторінка</p>
        <h1 className="mt-3 font-display text-3xl text-primary-deep">Вхід адміністратора</h1>
        <p className="mt-3 text-muted-foreground">
          Вхід через електронну пошту закладу.
        </p>

        {!codeSent ? (
          <form className="mt-7 space-y-4" onSubmit={requestCode}>
            <div className="space-y-2">
              <Label htmlFor="admin-email">Електронна пошта</Label>
              <Input
                id="admin-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
            <Button type="submit" disabled={busy} className="w-full font-display font-bold">
              {busy ? "Надсилаємо…" : "Надіслати лист для входу"}
            </Button>
          </form>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={verifyCode}>
            <div className="space-y-2">
              <Label htmlFor="admin-code">Код із листа</Label>
              <Input
                id="admin-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={busy || code.trim().length < 6} className="w-full font-display font-bold">
              {busy ? "Перевіряємо…" : "Увійти"}
            </Button>
            <Button type="button" variant="outline" className="w-full" disabled={busy} onClick={() => { setCodeSent(false); setMessage(''); }}>Надіслати лист повторно</Button>
          </form>
        )}

        {accessError && <p className="mt-5 text-destructive" role="alert">{accessError}</p>}
        {message && <p className="mt-5 text-sm text-muted-foreground" role="status">{message}</p>}
      </section>
    </main>
  );
}