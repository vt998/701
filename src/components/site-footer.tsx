import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-8 border-t border-primary-deep bg-primary-deep text-primary-foreground">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-8 text-sm sm:px-6 md:grid-cols-[1.4fr_1fr_1.4fr_auto] md:items-center">
        <p>ЗДО № 701 · м. Київ, Марганецька вул., 26A, 02092</p>
        <p>Зроблено з турботою про кожну дитину</p>
        <nav className="flex flex-wrap gap-x-4 gap-y-2 font-semibold">
          <Link to="/privacy" className="hover:underline">
            Політика конфіденційності
          </Link>
          <Link to="/accessibility" className="hover:underline">
            Доступність
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="https://www.facebook.com/groups/282211470089286/?ref=share_group_link&rdid=zDNuiahAzDYd5S37&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F1DL1kwYXvt%2F%23"
            target="_blank"
            rel="noreferrer"
            className="font-display font-bold hover:underline"
          >
            Facebook
          </a>
          <Link
            to="/admin"
            className="rounded-md border border-primary-foreground/60 px-3 py-1.5 font-display text-xs font-bold hover:bg-primary"
          >
            Вхід
          </Link>
        </div>
      </div>
    </footer>
  );
}
