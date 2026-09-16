import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-4 px-6 py-7 text-center toy-card sm:flex-row sm:text-left">
        <div className="flex items-center gap-3">
          <span className="grid size-11 place-items-center rounded-md border-2 border-primary-deep bg-sun font-display text-xs font-bold text-sun-foreground">
            701
          </span>
          <p className="text-sm text-muted-foreground">
            ЗДО № 701 — заклад дошкільної освіти
            <br />
            Пн–Пт, 7:30–18:30
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 font-display text-sm font-bold text-primary-deep">
          <Link to="/about">Про заклад</Link>
          <Link to="/groups">Групи</Link>
          <Link to="/news">Новини</Link>
          <Link to="/contacts">Контакти</Link>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        © 2026 ЗДО № 701 · Зроблено з турботою про кожну дитину
      </p>
    </footer>
  );
}
