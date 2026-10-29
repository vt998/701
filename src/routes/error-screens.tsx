import { useEffect, useState, type ReactNode } from "react";
import { Link, useRouter } from "@tanstack/react-router";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { WifiOff, X } from "lucide-react";

function Shell({
  code,
  title,
  text,
  children,
}: {
  code?: string;
  title: string;
  text: string;
  children: ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 text-center toy-card">
        {code && <p className="font-display text-6xl font-bold text-primary-deep">{code}</p>}
        <h1 className="mt-4 font-display text-2xl text-primary-deep">{title}</h1>
        <p className="mt-3 text-muted-foreground">{text}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">{children}</div>
      </div>
    </div>
  );
}

// 404: такої сторінки нема
export function NotFoundScreen() {
  return (
    <Shell code="404" title="Сторінку не знайдено" text="Такої сторінки не існує або вона переїхала.">
      <Link to="/" className="bg-primary text-primary-foreground toy-btn">
        На головну
      </Link>
    </Shell>
  );
}

// Збій під час показу сторінки (помилка в коді сторінки або даних)
export function ErrorScreen({ error, reset }: ErrorComponentProps) {
  const router = useRouter();
  console.error(error);

  return (
    <Shell
      title="Сторінка не завантажилась"
      text="Щось пішло не так. Спробуйте оновити сторінку або повернутися на головну."
    >
      <button
        type="button"
        onClick={() => {
          void router.invalidate();
          reset();
        }}
        className="bg-primary text-primary-foreground toy-btn"
      >
        Спробувати ще раз
      </button>
      <a href="/" className="bg-card text-primary-deep toy-btn">
        На головну
      </a>
    </Shell>
  );
}

// Довге завантаження сторінки (показується, якщо триває понад секунду)
export function LoadingScreen() {
  return (
    <div role="status" className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
      Завантаження…
    </div>
  );
}

// Пропав інтернет у відвідувача
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => {
      window.removeEventListener("online", update);
      window.removeEventListener("offline", update);
    };
  }, []);

  if (!offline) return null;

  return (
    <div
      role="status"
      className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 border-t border-primary-deep bg-secondary px-4 py-3 text-center text-sm font-bold text-primary-deep"
    >
      <WifiOff className="size-4 shrink-0" />
      Немає з’єднання з інтернетом. Деякі дані й фото можуть не завантажитись.
    </div>
  );
}

// Посилання для входу з листа прострочене або вже використане
export function AuthLinkErrorBanner() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const code = hash.get("error_code") ?? query.get("error_code");
    const error = hash.get("error") ?? query.get("error");
    if (!code && !error) return;
    setMessage(
      code === "otp_expired"
        ? "Посилання для входу застаріло: воно діє 30 хвилин і працює лише один раз. Запросіть нове."
        : "Не вдалося увійти за посиланням. Запросіть нове.",
    );
  }, []);

  function dismiss() {
    window.history.replaceState(null, "", window.location.pathname);
    setMessage(null);
  }

  if (!message) return null;

  return (
    <div role="alert" className="border-b border-primary-deep bg-secondary">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-3 px-4 py-3 text-sm sm:px-6">
        <span className="font-bold text-primary-deep">{message}</span>
        <Link to="/admin" onClick={dismiss} className="font-display font-bold text-accent underline">
          Запросити нове посилання
        </Link>
        <button type="button" onClick={dismiss} aria-label="Закрити" className="ml-auto rounded-md p-1 hover:bg-card">
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}