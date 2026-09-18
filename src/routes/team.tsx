import { createFileRoute } from "@tanstack/react-router";

import aboutImg from "@/assets/about-classroom.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Колектив — ЗДО № 701" },
      { name: "description", content: "Педагогічний та медичний колектив ЗДО № 701." },
      { property: "og:title", content: "Колектив — ЗДО № 701" },
      { property: "og:description", content: "Познайомтеся з колективом дитячого садочка № 701." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Team,
});

const team = [
  { role: "Директор", name: "Ім’я та прізвище", image: aboutImg },
  { role: "Вихователь групи «Джерельце»", name: "Ім’я та прізвище", image: gallery1 },
  { role: "Вихователь групи «Струмочок»", name: "Ім’я та прізвище", image: gallery2 },
  { role: "Вихователь групи «Ромашка»", name: "Ім’я та прізвище", image: gallery3 },
  { role: "Вихователь групи «Сонечко»", name: "Ім’я та прізвище", image: gallery4 },
  { role: "Вихователь групи «Калинка»", name: "Ім’я та прізвище", image: aboutImg },
];

function Team() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Наш колектив</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Люди, які щодня створюють для дітей турботливе, безпечне та цікаве середовище.
        </p>
      </section>
      <section className="grid gap-5 pb-14 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((person, index) => (
          <article key={`${person.role}-${index}`} className="overflow-hidden toy-card toy-hover">
            <p className="p-4 font-display text-sm font-bold text-accent">{person.role}</p>
            <img
              src={person.image}
              alt={`Фото: ${person.name}, ${person.role}`}
              width={816}
              height={816}
              className="aspect-square w-full border-y border-primary-deep object-cover"
            />
            <h2 className="p-4 font-display text-xl text-primary-deep">{person.name}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}