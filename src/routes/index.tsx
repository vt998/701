import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import { ZoomImage } from "@/components/zoom-image";
import { galleryImages, groups } from "@/lib/groups";

import heroImg from "@/assets/hero-kindergarten.jpg";
import aboutImg from "@/assets/about-classroom.jpg";

const ENROLL_URL = "https://portal.kyiv.digital/service/Zapys-do-sadochka";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ЗДО № 701 — дитячий садочок, де тепло і весело" },
      {
        name: "description",
        content:
          "Заклад дошкільної освіти № 701: затишні групи, творчі заняття, здорове харчування та запис дитини.",
      },
      { property: "og:title", content: "ЗДО № 701 — дитячий садочок" },
      {
        property: "og:description",
        content: "Затишні групи, творчі заняття, здорове харчування та запис дитини.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const quickInfo = [
  { icon: "⏰", title: "Графік роботи", lines: ["Пн–Пт, 7:00–19:00", "Сб, Нд — вихідні"] },
  {
    icon: "🏡",
    title: "Адреса",
    lines: ["м. Київ, Марганецька вул., 26A, 02092", "Кінцева: 33К, 555, 211"],
  },
  { icon: "☎️", title: "Телефон", lines: ["+38 068 319 68 12", "Kyivstar"] },
];

const news = [
  { date: "Щодня", tag: "Батькам", title: "День відкритих дверей 24/7", text: "Ми завжди відкриті до спілкування." },
  { date: "24/7", tag: "Безпека", title: "Наше укриття", text: "Для учасників освітнього процесу укриття працює цілодобово та розраховане на 300 осіб." },
];

const steps: { n: string; title: string; text: string; items?: string[] }[] = [
  { n: "1", title: "Онлайн запис", text: "Заповніть заявку в системі СЕ ЗДО." },
  { n: "2", title: "Прийняття запрошення", text: "Підтвердьте запрошення до закладу." },
  {
    n: "3",
    title: "Надання документів",
    text: "",
    items: [
      "Заява про зарахування",
      "Копія і оригінал свідоцтва про народження дитини",
      "Копія і оригінал медичної довідки про стан здоров’я дитини та карта профілактичних щеплень",
      "Згода на обробку персональних даних",
    ],
  },
  { n: "4", title: "Знайомство", text: "Зустріч із вихователем і екскурсія групою." },
];

const groupNames = groups.map((g) => g.name);

/** Перше фото кожної групи; стартова позиція зсувається щотижня автоматично. */
function weeklyFirstPhotos() {
  const firsts = groups.map((g) => g.photos[0] ?? galleryImages[0]!);
  const week = Math.floor(Date.now() / (7 * 24 * 3600 * 1000));
  const off = week % firsts.length;
  return firsts.map((_, i) => firsts[(i + off) % firsts.length]!);
}

function Home() {
  const galleryGroups = ["Усі", ...groupNames];
  const [selectedGalleryGroup, setSelectedGalleryGroup] = useState("Усі");
  const visibleGallery =
    selectedGalleryGroup === "Усі"
      ? weeklyFirstPhotos()
      : (groups.find((g) => g.name === selectedGalleryGroup)?.photos ?? galleryImages);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Герой */}
      <section className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md border-2 border-primary-deep bg-sun px-4 py-1.5 font-display text-xs font-bold text-sun-foreground">
            🌻 Набір на поточний навчальний рік відкрито
          </span>
          <h1 className="mt-5 font-display text-4xl leading-tight text-primary-deep sm:text-5xl">
            Садочок, де дитина росте в теплі й дружбі
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted-foreground">
            Дитячий садок пишається тим, що дотримується найвищих стандартів освіти та виховання.
            Наш сумлінний персонал прагне забезпечити сприятливе середовище, в якому буде
            розвиватися ваша дитина.
          </p>
          <p className="mt-4 max-w-prose font-display text-lg text-primary-deep">__________</p>
        </div>
        <div className="overflow-hidden p-3 toy-card">
          <img
            src={heroImg}
            alt="Будівля дитячого садочка № 701 із зеленим дахом, діти грають у дворі"
            width={1440}
            height={1008}
            className="w-full rounded-2xl"
          />
        </div>
      </section>

      {/* Швидка інформація */}
      <section className="grid gap-4 pb-12 sm:grid-cols-3">
        {quickInfo.map((item) => (
          <div key={item.title} className="p-6 toy-card toy-hover">
            <span className="grid size-12 place-items-center rounded-md border-2 border-primary-deep bg-mint text-xl">
              {item.icon}
            </span>
            <h2 className="mt-4 font-display text-lg text-primary-deep">{item.title}</h2>
            {item.lines.map((line) => (
              <p key={line} className="text-sm text-muted-foreground">
                {line}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* Про заклад */}
      <section className="grid items-center gap-8 pb-14 lg:grid-cols-2">
        <div className="order-2 p-3 toy-card lg:order-1">
          <img
            src={aboutImg}
            alt="Затишний куточок групи: дерев’яні кубики, книжки та подушки"
            width={1024}
            height={1200}
            loading="lazy"
            className="w-full rounded-2xl"
          />
        </div>
        <div className="order-1 lg:order-2">
          <p className="font-display text-sm font-bold text-accent">Про заклад</p>
          <h2 className="mt-3 font-display text-3xl text-primary-deep sm:text-4xl">
            Місце, куди хочеться повертатися
          </h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Світлі просторі групи, безпечний майданчик і вихователі, що турбуються про дітей кожної
            секунди.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Власний ігровий майданчик і зелений двір",
              "Музика, хореографія та художня майстерня",
              "Трьохразове харчування за збалансованим меню",
              "Логопед і практичний психолог",
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span className="grid size-7 shrink-0 place-items-center rounded-md border-2 border-primary-deep bg-sun text-xs">
                  ✓
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Групи */}
      <section className="pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-primary-deep sm:text-4xl">Наші групи</h2>
          <Link to="/groups" className="font-display text-sm font-bold text-accent">
            Усі групи →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {groups.map((g) => (
            <div key={g.slug} className="p-5 toy-card">
              <span
                className={`inline-block rounded-md border-2 border-primary-deep px-3 py-1 font-display text-xs font-bold text-primary-deep ${g.color}`}
              >
                {g.age}
              </span>
              <p className="mt-3 font-display text-xs font-bold text-accent">{g.type}</p>
              <h3 className="mt-4 font-display text-xl text-primary-deep">{g.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{g.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Дошка оголошень */}
      <section className="pb-14">
        <div className="border-2 border-primary-deep bg-primary p-6 text-primary-foreground shadow-toy sm:p-8 rounded-3xl">
          <h2 className="mb-6 font-display text-3xl">Дошка оголошень</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {news.map((n) => (
              <article key={n.title} className="p-5 text-foreground toy-card toy-hover">
                <div className="flex items-center justify-between">
                  <span className="font-display text-xs font-bold text-accent">{n.date}</span>
                  <span className="rounded-md border-2 border-primary-deep bg-mint px-2.5 py-0.5 text-xs font-bold text-primary-deep">
                    {n.tag}
                  </span>
                </div>
                <h3 className="mt-3 font-display text-lg text-primary-deep">{n.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{n.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Галерея */}
      <section className="pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-primary-deep sm:text-4xl">Наше життя</h2>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {galleryGroups.map((group) => (
              <Button
                key={group}
                type="button"
                variant={selectedGalleryGroup === group ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedGalleryGroup(group)}
                className="shrink-0 border-primary-deep font-display font-bold"
              >
                {group}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {visibleGallery.map((img, index) => (
            <div
              key={`${selectedGalleryGroup}-${img.alt}-${index}`}
              className="min-w-[220px] p-2 toy-card toy-hover sm:min-w-[260px]"
            >
              <ZoomImage
                src={img.src}
                alt={img.alt}
                width={816}
                height={816}
                className="aspect-video w-full rounded-2xl object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Як записати */}
      <section className="pb-14">
        <div className="p-6 toy-card sm:p-8">
          <p className="font-display text-sm font-bold text-accent">Запис</p>
          <h2 className="mt-3 font-display text-3xl text-primary-deep sm:text-4xl">
            Чотири кроки до вашого місця
          </h2>
          <div className="mt-8 grid gap-6 md:grid-cols-4">
            {steps.map((s) => (
              <div key={s.n}>
                <span className="grid size-12 place-items-center rounded-md border-2 border-primary-deep bg-sun font-display text-lg font-bold text-sun-foreground shadow-toy-sm">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-lg text-primary-deep">{s.title}</h3>
                {s.text && <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>}
                {s.items && (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                    {s.items.map((it) => (
                      <li key={it}>{it}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href={ENROLL_URL}
              target="_blank"
              rel="noreferrer"
              className="bg-primary text-primary-foreground toy-btn"
            >
              Записати дитину
            </a>
            <Link to="/contacts" className="bg-card text-primary-deep toy-btn">
              Звʼязатися з нами
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
