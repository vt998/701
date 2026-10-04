import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакти та запис дитини — ЗДО № 701" },
      {
        name: "description",
        content: "Адреса, телефон і графік роботи ЗДО № 701, електронна пошта та карта.",
      },
      { property: "og:title", content: "Контакти та запис дитини — ЗДО № 701" },
      {
        property: "og:description",
        content: "Адреса, телефон, графік роботи та карта у ЗДО № 701.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contacts,
});

const contacts = [
  { label: "Адреса", value: "м. Київ, Марганецька вул., 26A, 02092" },
  { label: "Транспорт", value: "Кінцева: 33К, 555, 211" },
  { label: "Телефон", value: "+38 068 319 68 12 (kyivstar)" },
  { label: "Електронна пошта", value: "dnz701@ukr.net" },
  { label: "Графік роботи", value: "Пн–Пт, 7:00–19:00" },
  { label: "Прийом батьків", value: "Пн–Пт, 8:30–16:00" },
];


const mapQuery = encodeURIComponent("Марганецька вулиця 26А, Київ");
const mapLink = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

function Contacts() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Контакти</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Завітайте до нас — покажемо групи й розкажемо про вільні місця.
        </p>
      </section>

      <section className="grid gap-6 pb-14 lg:grid-cols-2">
        <div className="p-6 toy-card">
          <ul className="space-y-4">
            {contacts.map((c) => (
              <li key={c.label}>
                <p className="font-display text-xs font-bold text-accent">{c.label}</p>
                <p className="text-lg text-primary-deep">{c.value}</p>
              </li>
            ))}
          </ul>
          <a href="tel:+380683196812" className="mt-6 bg-primary text-primary-foreground toy-btn">
            Зателефонувати
          </a>
        </div>
        <a
          href={mapLink}
          target="_blank"
          rel="noreferrer"
          aria-label="Відкрити розташування ЗДО № 701 у Google Картах"
          className="group relative block p-3 toy-card toy-hover"
        >
          <iframe
            title="Карта — ЗДО № 701 на Google Картах"
            src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
            loading="lazy"
            className="pointer-events-none h-72 w-full rounded-2xl border-0 sm:h-80"
          />
          <span className="mt-3 inline-block font-display text-sm font-bold text-accent group-hover:underline">
            Відкрити в Google Картах →
          </span>
        </a>
      </section>

    </main>
  );
}
