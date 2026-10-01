import { Link } from "@tanstack/react-router";

const FB =
  "https://www.facebook.com/groups/282211470089286/?ref=share_group_link&rdid=zDNuiahAzDYd5S37&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2Fg%2F1DL1kwYXvt%2F%23";

export function SiteFooter() {
  const item = "font-display text-sm font-semibold";
  return (
    <footer className="mt-8 border-t border-primary-deep bg-primary-deep text-primary-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:px-6 md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-x-8">
        <p className={item}>ЗДО № 701 · м. Київ, Марганецька вул., 26A, 02092</p>
        <p className={item}>Зроблено з турботою про кожну дитину</p>
        <Link to="/privacy" className={`${item} hover:underline`}>
          Політика конфіденційності
        </Link>
        <Link to="/accessibility" className={`${item} hover:underline`}>
          Доступність
        </Link>
        <a href={FB} target="_blank" rel="noreferrer" className={`${item} hover:underline`}>
          Facebook
        </a>
        <Link to="/admin" className={`${item} hover:underline`}>
          Вхід
        </Link>
      </div>
    </footer>
  );
}
