import { createFileRoute } from "@tanstack/react-router";

import aboutImg from "@/assets/about-classroom.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import heroImg from "@/assets/hero-kindergarten.jpg";
import { ZoomImage } from "@/components/zoom-image";
import { groups } from "@/lib/groups";

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

const staffImages = [aboutImg, gallery1, gallery2, gallery3, gallery4, heroImg];

type Staff = { role: string; image: string };

const staff: Staff[] = [
  { role: "Директор", image: aboutImg },
  { role: "Вихователь-методист", image: gallery1 },
  ...groups.flatMap((group, i) => [
    { role: `Вихователь 1 · група «${group.name}»`, image: staffImages[i % staffImages.length]! },
    { role: `Вихователь 2 · група «${group.name}»`, image: staffImages[(i + 1) % staffImages.length]! },
    { role: `Помічник вихователя · група «${group.name}»`, image: staffImages[(i + 2) % staffImages.length]! },
  ]),
  { role: "Інструктор з фізичного виховання", image: gallery3 },
  { role: "Музичний керівник", image: gallery2 },
  { role: "Логопед", image: gallery1 },
  { role: "Практичний психолог", image: gallery3 },
  { role: "Медична сестра", image: gallery4 },
  { role: "Завідувач господарством", image: aboutImg },
  { role: "Комірник", image: heroImg },
  { role: "Кухар", image: gallery4 },
  { role: "Кухар", image: gallery4 },
  { role: "Праля", image: aboutImg },
  { role: "Робітник з обслуговування", image: heroImg },
  { role: "Головна бабуся нашого садочка", image: gallery2 },
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
        {staff.map((person, index) => (
          <article key={`${person.role}-${index}`} className="overflow-hidden toy-card toy-hover">
            <p className="p-4 font-display text-sm font-bold text-accent">{person.role}</p>
            <ZoomImage
              src={person.image}
              alt={`Фото: ${person.role}`}
              width={816}
              height={816}
              className="aspect-square w-full border-y border-primary-deep object-cover"
            />
            <h2 className="p-4 font-display text-xl text-primary-deep">Ім’я та прізвище</h2>
          </article>
        ))}
      </section>
    </main>
  );
}
