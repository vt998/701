import { Link } from "@tanstack/react-router";

const FB =
  "https://www.facebook.com/groups/282211470089286/?ref=share_group_link&rdid=zDNuiahAzDYd5S37&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F1DL1kwYXvt%2F%23";

export function SiteFooter() {
  const item = "font-display text-sm font-semibold";
  return (
    <footer className="mt-8 border-t border-primary-deep bg-primary-deep text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-4 border-b border-primary-foreground/25 pb-5 md:grid-cols-2">
          <p className={item}>ЗДО № 701 · м. Київ, Марганецька вул., 26A, 02092</p>
          <p className={`${item} md:text-right`}>+38 068 319 68 12 (kyivstar)</p>
        </div>
        <div className="flex flex-col gap-5 pt-5 lg:flex-row lg:items-center lg:justify-between">
          <p className={item}>Зроблено з турботою про кожну дитину</p>
          <nav aria-label="Посилання внизу сторінки" className="flex flex-wrap items-center gap-x-6 gap-y-4">
            <Link to="/privacy" className={`${item} hover:underline`}>Політика конфіденційності</Link>
            <Link to="/accessibility" className={`${item} hover:underline`}>Доступність</Link>
            <a href={FB} target="_blank" rel="noreferrer" className={`${item} hover:underline`}>Facebook</a>
            <Link to="/admin" className={`${item} hover:underline`}>Вхід</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
