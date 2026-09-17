import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/groups")({
  head: () => ({
    meta: [
      { title: "Групи — ЗДО № 701" },
      {
        name: "description",
        content: "Групи ЗДО № 701 для дітей від 1 до 6 років: вік, кількість дітей і заняття.",
      },
      { property: "og:title", content: "Групи — ЗДО № 701" },
      {
        property: "og:description",
        content: "Вік, наповнюваність і заняття в кожній групі дитячого садочка № 701.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Groups,
});

const groups = [
  {
    name: "Джерельце",
    type: "Малюки",
    age: "1–3 роки",
    kids: "до 15 дітей",
    text: "Мʼяка адаптація, сенсорні ігри, багато руху та обіймів.",
    activities: ["Сенсорика", "Пальчикові ігри", "Музичні хвилинки"],
    color: "bg-sun",
  },
  {
    name: "Струмочок",
    type: "Малюки",
    age: "1–3 роки",
    kids: "до 20 дітей",
    text: "Мʼяка адаптація, багато обіймів і руху.",
    activities: ["Рухливі ігри", "Малювання", "Ліплення"],
    color: "bg-mint",
  },
  {
    name: "Ромашка",
    type: "Малюки",
    age: "1–3 роки",
    kids: "до 20 дітей",
    text: "Мʼяка адаптація, багато обіймів і руху.",
    activities: ["Казки", "Природа", "Хореографія"],
    color: "bg-sun",
  },
  {
    name: "Сонечко",
    type: "Дорослі малюки",
    age: "3–6 років",
    kids: "до 22 дітей",
    text: "Розвиток мовлення й перші творчі проєкти.",
    activities: ["Мовлення", "Творчість", "Музика"],
    color: "bg-mint",
  },
  {
    name: "Калинка",
    type: "Дорослі малюки",
    age: "4–6 років",
    kids: "до 22 дітей",
    text: "Досліди, спільні ігри, пізнання світу.",
    activities: ["Досліди", "Лічба", "Логіка"],
    color: "bg-mint",
  },
];

function Groups() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Наші групи</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          У садочку працюють групи для дітей від 1 до 6 років. Дитину зараховуємо у групу за віком
          і наявними місцями.
        </p>
      </section>

      <section className="grid gap-4 pb-14 sm:grid-cols-2">
        {groups.map((g) => (
          <article key={g.name} className="p-6 toy-card toy-hover">
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-md border-2 border-primary-deep px-3 py-1 font-display text-xs font-bold text-primary-deep ${g.color}`}
              >
                {g.age}
              </span>
              <span className="font-display text-xs font-bold text-accent">{g.type}</span>
              <span className="text-xs text-muted-foreground">{g.kids}</span>
            </div>
            <h2 className="mt-4 font-display text-2xl text-primary-deep">{g.name}</h2>
            <p className="mt-2 text-muted-foreground">{g.text}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {g.activities.map((a) => (
                <li
                  key={a}
                  className="rounded-md border-2 border-primary-deep bg-background px-3 py-1 text-xs font-bold"
                >
                  {a}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="pb-14">
        <div className="p-6 text-center toy-card sm:p-8">
          <h2 className="font-display text-2xl text-primary-deep">Хочете місце у групі?</h2>
          <p className="mt-2 text-muted-foreground">
            Зателефонуйте або завітайте до адміністрації — підкажемо, де є вільні місця.
          </p>
          <Link to="/contacts" className="mt-6 bg-primary text-primary-foreground toy-btn">
            Записати дитину
          </Link>
        </div>
      </section>
    </main>
  );
}
