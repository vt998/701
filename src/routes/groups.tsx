import { createFileRoute, Link } from "@tanstack/react-router";

import { groups } from "@/lib/groups";

export const Route = createFileRoute("/groups")({
  head: () => ({
    meta: [
      { title: "Групи — ЗДО № 701" },
      {
        name: "description",
        content: "Групи ЗДО № 701 для дітей від 1 до 6 років: вік, заняття та фото кожної групи.",
      },
      { property: "og:title", content: "Групи — ЗДО № 701" },
      {
        property: "og:description",
        content: "Вік, заняття та фото кожної групи дитячого садочка № 701.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Groups,
});

function Groups() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Наші групи</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          У садочку працюють групи для дітей від 1 до 6 років. Натисніть на групу, щоб побачити
          її фото та заняття.
        </p>
      </section>

      <section className="grid gap-4 pb-14 sm:grid-cols-2">
        {groups.map((g, index) => (
          <Link
            key={g.slug}
            to="/groups/$slug"
            params={{ slug: g.slug }}
            className={`p-6 toy-card toy-hover ${index === groups.length - 1 ? "sm:col-span-2 sm:mx-auto sm:w-[calc(50%-0.5rem)]" : ""}`}
          >
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-md border-2 border-primary-deep px-3 py-1 font-display text-xs font-bold text-primary-deep ${g.color}`}
              >
                {g.age}
              </span>
              <span className="font-display text-xs font-bold text-accent">{g.type}</span>
            </div>
            <h2 className="mt-4 font-display text-2xl text-primary-deep">{g.name}</h2>
            <p className="mt-2 text-muted-foreground">{g.text}</p>
            <p className="mt-4 font-display text-sm font-bold text-accent">Дивитись групу →</p>
          </Link>
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
