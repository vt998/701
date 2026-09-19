import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Документи — ЗДО № 701" },
      {
        name: "description",
        content: "Статут ЗДО № 701 у форматі PDF — для ознайомлення батьками.",
      },
      { property: "og:title", content: "Документи — ЗДО № 701" },
      { property: "og:description", content: "Статут дитячого садочка № 701 у PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Documents,
});

function Documents() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Документи</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Офіційний документ закладу — можна відкрити або завантажити у форматі PDF.
        </p>
      </section>

      <section className="pb-14">
        <h2 className="font-display text-2xl text-primary-deep">Установчі документи</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          <li className="flex items-start gap-4 p-5 toy-card">
            <span className="grid size-12 shrink-0 place-items-center rounded-md border-2 border-primary-deep bg-sun font-display text-[11px] font-bold text-sun-foreground">
              PDF
            </span>
            <div className="min-w-0">
              <a
                href="/documents/statut.pdf"
                target="_blank"
                rel="noreferrer"
                className="font-display text-lg font-bold text-primary-deep underline decoration-2 underline-offset-4"
              >
                Статут закладу
              </a>
              <p className="mt-1 text-sm text-muted-foreground">Заготовка документа</p>
              <a
                href="/documents/statut.pdf"
                download
                className="mt-3 inline-flex bg-primary text-primary-foreground toy-btn"
              >
                Завантажити
              </a>
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
