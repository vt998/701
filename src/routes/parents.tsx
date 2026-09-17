import { createFileRoute } from "@tanstack/react-router";

import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "Новини та оголошення — ЗДО № 701" },
      {
        name: "description",
        content: "Свята, оголошення та важливі новини дитячого садочка № 701 для батьків.",
      },
      { property: "og:title", content: "Новини та оголошення — ЗДО № 701" },
      {
        property: "og:description",
        content: "Свята, оголошення та важливі новини для батьків ЗДО № 701.",
      },
    ],
  }),
  component: News,
});

const posts = [
  {
    date: "22 травня",
    tag: "Свято",
    title: "«День квітів» для батьків",
    text: "Діти всіх груп готують пісні та букети з паперу. Початок о 11:00 у святковій залі, просимо прийти на 15 хвилин раніше.",
    img: gallery2,
    alt: "Діти співають і танцюють у музичній залі",
  },
  {
    date: "24 травня",
    tag: "Відкриті двері",
    title: "Екскурсія для нових родин",
    text: "Покажемо групи, майданчик і кухню, розкажемо про режим дня та відповімо на запитання. Початок о 10:00.",
    img: gallery3,
    alt: "Дитячий майданчик із гіркою та гойдалками",
  },
  {
    date: "1 червня",
    tag: "Розклад",
    title: "Літній режим дня",
    text: "З 1 червня більше часу на прогулянки, ігри з водою та відпочинок. Сніданок переносимо на 8:30.",
    img: gallery4,
    alt: "Обід у садочку: суп, фрукти та молоко",
  },
];

const notices = [
  "Меню на тиждень оновлюємо щопонеділка у холі та групах.",
  "Довідку після хвороби приносимо в перший день повернення.",
  "Питання щодо оплати — до адміністрації, 8:30–17:00.",
];

function News() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Новини та оголошення</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Усе найважливіше для батьків: свята, зміни в розкладі та нагадування.
        </p>
      </section>

      <section className="grid gap-5 pb-14">
        {posts.map((p) => (
          <article key={p.title} className="grid gap-5 p-5 toy-card sm:grid-cols-[220px_1fr]">
            <img
              src={p.img}
              alt={p.alt}
              width={816}
              height={816}
              loading="lazy"
              className="aspect-square w-full rounded-2xl border-2 border-primary-deep object-cover"
            />
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-display text-xs font-bold text-accent">{p.date}</span>
                <span className="rounded-md border-2 border-primary-deep bg-mint px-2.5 py-0.5 text-xs font-bold text-primary-deep">
                  {p.tag}
                </span>
              </div>
              <h2 className="mt-3 font-display text-2xl text-primary-deep">{p.title}</h2>
              <p className="mt-2 text-muted-foreground">{p.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="pb-14">
        <div className="border-2 border-primary-deep bg-primary p-6 text-primary-foreground shadow-toy sm:p-8 rounded-3xl">
          <h2 className="font-display text-2xl">Пам’ятка для батьків</h2>
          <ul className="mt-5 grid gap-3 md:grid-cols-3">
            {notices.map((n) => (
              <li key={n} className="p-4 text-sm text-foreground toy-card">
                {n}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
