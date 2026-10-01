import { createFileRoute, Link, notFound } from "@tanstack/react-router";

import { groups } from "@/lib/groups";
import { ZoomImage } from "@/components/zoom-image";

export const Route = createFileRoute("/groups/$slug")({
  head: ({ params }) => {
    const group = groups.find((g) => g.slug === params.slug);
    return {
      meta: [
        { title: `Група «${group?.name ?? "ЗДО № 701"}» — ЗДО № 701` },
        {
          name: "description",
          content: group
            ? `Група «${group.name}» ЗДО № 701: ${group.age}, заняття та фото.`
            : "Група дитячого садочка № 701.",
        },
        { property: "og:title", content: `Група «${group?.name ?? "ЗДО № 701"}» — ЗДО № 701` },
        {
          property: "og:description",
          content: group ? `Вік, заняття та фото групи «${group.name}».` : "Група дитячого садочка № 701.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: GroupPage,
});

function GroupPage() {
  const { slug } = Route.useParams();
  const group = groups.find((g) => g.slug === slug);
  if (!group) throw notFound();

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <Link to="/groups" className="font-display text-sm font-bold text-accent">
          ← Усі групи
        </Link>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-md border-2 border-primary-deep px-3 py-1 font-display text-xs font-bold text-primary-deep ${group.color}`}
          >
            {group.age}
          </span>
          <span className="font-display text-xs font-bold text-accent">{group.type}</span>
        </div>
        <h1 className="mt-4 font-display text-4xl text-primary-deep sm:text-5xl">Група «{group.name}»</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">{group.text}</p>
        <ul className="mt-5 flex flex-wrap gap-2">
          {group.activities.map((a) => (
            <li
              key={a}
              className="rounded-md border-2 border-primary-deep bg-background px-3 py-1 text-xs font-bold"
            >
              {a}
            </li>
          ))}
        </ul>
      </section>

      <section className="pb-14">
        <h2 className="mb-6 font-display text-3xl text-primary-deep">Наші фото</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {group.photos.map((photo, index) => (
            <div key={`${photo.alt}-${index}`} className="p-2 toy-card toy-hover">
              <ZoomImage
                src={photo.src}
                alt={`${photo.alt}, група «${group.name}»`}
                width={816}
                height={816}
                className="aspect-square w-full rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <div className="p-6 text-center toy-card sm:p-8">
          <h2 className="font-display text-2xl text-primary-deep">Хочете місце у цій групі?</h2>
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
