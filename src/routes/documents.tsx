import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Документи — ЗДО № 701" },
      {
        name: "description",
        content:
          "Меню, накази, статут та інші документи ЗДО № 701 у форматі PDF — для завантаження батьками.",
      },
      { property: "og:title", content: "Документи — ЗДО № 701" },
      {
        property: "og:description",
        content: "Меню, накази та офіційні документи дитячого садочка № 701 у PDF.",
      },
    ],
  }),
  component: Documents;
});

type Doc = { title: string; note: string; file: string; size: string };

const groups: { section: string; items: Doc[] }[] = [
  {
    section: "Харчування",
    items: [
      {
        title: "Меню на тиждень",
        note: "Приклад документа — замінимо на актуальне меню",
        file: "/documents/menu.pdf",
        size: "PDF",
      },
      {
        title: "Норми харчування дітей",
        note: "Заготовка документа",
        file: "/documents/normy-kharchuvannya.pdf",
        size: "PDF",
      },
    ],
  },
  {
    section: "Накази та розпорядження",
    items: [
      {
        title: "Наказ про зарахування дітей",
        note: "Заготовка документа",
        file: "/documents/nakaz-zarahuvannya.pdf",
        size: "PDF",
      },
      {
        title: "Наказ про режим роботи закладу",
        note: "Заготовка документа",
        file: "/documents/nakaz-rezhym-roboty.pdf",
        size: "PDF",
      },
    ],
  },
  {
    section: "Установчі документи",
    items: [
      {
        title: "Статут закладу",
        note: "Заготовка документа",
        file: "/documents/statut.pdf",
        size: "PDF",
      },
      {
        title: "Правила внутрішнього розпорядку",
        note: "Заготовка документа",
        file: "/documents/pravyla-rozporyadku.pdf",
        size: "PDF",
      },
    ],
  },
];

function Documents() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Документи</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Тут публікуємо меню, накази та офіційні документи закладу. Кожен документ можна
          відкрити або завантажити у форматі PDF.
        </p>
      </section>

      <section className="grid gap-8 pb-14">
        {groups.map((g) => (
          <div key={g.section}>
            <h2 className="font-display text-2xl text-primary-deep">{g.section}</h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {g.items.map((d) => (
                <li key={d.title} className="flex items-start gap-4 p-5 toy-card">
                  <span className="grid size-12 shrink-0 place-items-center rounded-md border-2 border-primary-deep bg-sun font-display text-[11px] font-bold text-sun-foreground">
                    {d.size}
                  </span>
                  <div className="min-w-0">
                    <a
                      href={d.file}
                      target="_blank"
                      rel="noreferrer"
                      className="font-display text-lg font-bold text-primary-deep underline decoration-2 underline-offset-4"
                    >
                      {d.title}
                    </a>
                    <p className="mt-1 text-sm text-muted-foreground">{d.note}</p>
                    <a
                      href={d.file}
                      download
                      className="mt-3 inline-flex bg-primary text-primary-foreground toy-btn"
                    >
                      Завантажити
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="pb-14">
        <div className="rounded-3xl border-2 border-primary-deep bg-primary p-6 text-primary-foreground shadow-toy sm:p-8">
          <h2 className="font-display text-2xl">Потрібен документ, якого немає?</h2>
          <p className="mt-3 max-w-prose">
            Напишіть або зателефонуйте до адміністрації — додамо файл на сайт.
          </p>
        </div>
      </section>
    </main>
  );
}
