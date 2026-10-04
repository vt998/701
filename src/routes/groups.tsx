import { createFileRoute } from "@tanstack/react-router";

import { GroupGallery } from "@/components/group-gallery";

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
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Галерея за групами</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Джерельце, Струмочок, Ромашка, Сонечко та Калинка — життя нашого садочка.
        </p>
      </section>

      <section className="pb-14"><GroupGallery /></section>

      <section className="pb-14">
        <div className="p-6 text-center toy-card sm:p-8">
          <h2 className="font-display text-2xl text-primary-deep">Хочете місце у групі?</h2>
          <p className="mt-2 text-muted-foreground">
            Зателефонуйте або завітайте до адміністрації — підкажемо, де є вільні місця.
          </p>
          <a
            href="https://portal.kyiv.digital/service/Zapys-do-sadochka"
            target="_blank"
            rel="noreferrer"
            className="mt-6 bg-primary text-primary-foreground toy-btn"
          >
            Записати дитину
          </a>
        </div>
      </section>
    </main>
  );
}
