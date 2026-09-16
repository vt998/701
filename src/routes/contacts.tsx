import { createFileRoute } from "@tanstack/react-router";

import heroImg from "@/assets/hero-kindergarten.jpg";

export const Route = createFileRoute("/contacts")({
  head: () => ({
    meta: [
      { title: "Контакти та запис дитини — ЗДО № 701" },
      {
        name: "description",
        content: "Адреса, телефон і графік роботи ЗДО № 701, а також перелік документів для запису.",
      },
      { property: "og:title", content: "Контакти та запис дитини — ЗДО № 701" },
      {
        property: "og:description",
        content: "Адреса, телефон, графік роботи та документи для запису дитини у ЗДО № 701.",
      },
    ],
  }),
  component: Contacts,
});

const contacts = [
  { label: "Адреса", value: "м. Київ, вул. Сонячна, 14" },
  { label: "Телефон", value: "+38 (044) 123 70 01" },
  { label: "Електронна пошта", value: "zdo701@ukr.net" },
  { label: "Графік роботи", value: "Пн–Пт, 7:30–18:30" },
  { label: "Прийом батьків", value: "Пн–Пт, 8:30–17:00" },
];

const documents = [
  "Заява батьків або опікуна",
  "Копія свідоцтва про народження дитини",
  "Медична довідка форми 026/о та карта профілактичних щеплень",
  "Копія паспорта одного з батьків",
];

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
          <a href="tel:+380441237001" className="mt-6 bg-primary text-primary-foreground toy-btn">
            Зателефонувати
          </a>
        </div>
        <div className="p-3 toy-card">
          <img
            src={heroImg}
            alt="Будівля дитячого садочка № 701 із зеленим дахом"
            width={1440}
            height={1008}
            loading="lazy"
            className="w-full rounded-2xl"
          />
        </div>
      </section>

      <section className="pb-14">
        <div className="p-6 toy-card sm:p-8">
          <h2 className="font-display text-3xl text-primary-deep">Документи для запису</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {documents.map((d) => (
              <li key={d} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-primary-deep bg-sun text-xs">
                  ✓
                </span>
                <span className="text-sm">{d}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted-foreground">
            Дані на сайті поки що приблизні — надішліть, будь ласка, справжню адресу, телефон і
            перелік груп, і ми їх одразу замінимо.
          </p>
        </div>
      </section>
    </main>
  );
}
