import { Link } from "@tanstack/react-router";
import { useState } from "react";

const nav = [
  { to: "/", label: "Головна" },
  { to: "/about", label: "Про заклад" },
  { to: "/groups", label: "Групи" },
  { to: "/news", label: "Новини" },
  { to: "/contacts", label: "Контакти" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid size-12 place-items-center rounded-md border-2 border-primary-deep bg-sun font-display text-sm font-bold text-sun-foreground shadow-toy-sm">
            701
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-primary-deep">ЗДО № 701</span>
            <span className="block text-xs text-muted-foreground">дитячий садочок</span>
          </span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              className="rounded-md px-4 py-2 font-display text-sm font-bold text-foreground transition-colors hover:bg-secondary"
              activeProps={{ className: "bg-secondary text-primary-deep" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/contacts"
          className="ml-auto hidden bg-primary text-primary-foreground toy-btn md:ml-2 md:inline-flex"
        >
          Записати дитину
        </Link>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Меню"
          className="ml-auto grid size-12 place-items-center rounded-md border-2 border-primary-deep bg-card font-display text-lg shadow-toy-sm md:hidden"
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <div className="mx-4 mb-3 grid gap-1 p-3 toy-card md:hidden">
          {nav.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="rounded-md px-4 py-2 font-display text-sm font-bold"
              activeProps={{ className: "bg-secondary text-primary-deep" }}
              activeOptions={{ exact: item.to === "/" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
