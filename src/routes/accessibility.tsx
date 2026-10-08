import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/accessibility")({
  head: () => ({
    meta: [
      { title: "Доступність сайту — ЗДО № 701" },
      { name: "description", content: "Інформація про доступність сайту ЗДО № 701." },
      { property: "og:title", content: "Доступність сайту — ЗДО № 701" },
      { property: "og:description", content: "Інформація про доступність матеріалів сайту ЗДО № 701." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Accessibility,
});

function Accessibility() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Доступність сайту</h1>
      <p className="mt-6 max-w-prose text-lg text-muted-foreground">
        Ми прагнемо, щоб інформація про ЗДО № 701 була зрозумілою та доступною для всіх родин.
      </p>
      <p className="mt-6 text-sm text-muted-foreground">Значки: <a className="underline" href="https://www.flaticon.com/" target="_blank" rel="noreferrer">Magnific та Freepik / Flaticon</a>.</p>
    </main>
  );
}