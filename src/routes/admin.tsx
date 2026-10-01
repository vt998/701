import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";

const ADMIN_EMAIL = "dnz701@ukr.net";

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
      options: { shouldCreateUser: true },
    });
    setBusy(false);

    if (error) {
      setMessage("Не вдалося надіслати код. Спробуйте ще раз.");
      return;
    }

    setCodeSent(true);
    setMessage("Код входу надіслано на електронну пошту адміністратора.");
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

    const { error: roleError } = await supabase.from("user_roles").upsert(
      { user_id: data.user.id, role: "admin" },
      { onConflict: "user_id,role", ignoreDuplicates: true },
    );
    setBusy(false);
    setMessage(
      roleError
        ? "Вхід виконано, але кабінет адміністратора ще налаштовується."
        : "Вхід виконано. Кабінет керування фотографіями ще налаштовується.",
    );
  }

  return (
    <main className="mx-auto w-full max-w-xl px-4 py-12 sm:px-6">
      <section className="p-6 toy-card sm:p-8">
        <p className="font-display text-sm font-bold text-accent">Захищена сторінка</p>
        <h1 className="mt-3 font-display text-3xl text-primary-deep">Вхід адміністратора</h1>
        <p className="mt-3 text-muted-foreground">
          Отримайте одноразовий код на електронну пошту закладу.
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
              {busy ? "Надсилаємо…" : "Отримати код"}
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
          </form>
        )}

        {message && <p className="mt-5 text-sm text-muted-foreground" role="status">{message}</p>}
      </section>
    </main>
  );
}