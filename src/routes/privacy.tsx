import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Політика конфіденційності — ЗДО № 701" },
      { name: "description", content: "Політика конфіденційності сайту ЗДО № 701." },
      { property: "og:title", content: "Політика конфіденційності — ЗДО № 701" },
      { property: "og:description", content: "Як сайт ЗДО № 701 працює з особистими даними відвідувачів." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Privacy,
});

function Privacy() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Політика конфіденційності</h1>
      <div className="mt-8 space-y-6 text-muted-foreground">
        <p>Сайт ЗДО № 701 не збирає особисті дані відвідувачів без їхньої згоди.</p>
        <p>Звертаючись до закладу телефоном, ви самостійно вирішуєте, яку інформацію повідомити.</p>
        <p>Посилання на зовнішні сайти мають власні правила конфіденційності.</p>
      </div>
    </main>
  );
}