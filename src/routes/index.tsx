import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";

import heroImg from "@/assets/hero-kindergarten.jpg";
import aboutImg from "@/assets/about-classroom.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

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
    ],
  }),
  component: Home,
});

const quickInfo = [
  { icon: "⏰", title: "Графік роботи", lines: ["Пн–Пт, 7:00–19:00", "Сб, Нд — вихідні"] },
  {
    icon: "🏡",
    title: "Адреса",
    lines: ["м. Київ, Марганецька вул., 26A, 02192", "кінцева автобуса 33К і маршруток 555 та 211"],
  },
  { icon: "☎️", title: "Телефон", lines: ["+38 068 319 68 12", "Kyivstar"] },
];

const groups = [
  { age: "1–3 р.", type: "Малюки", name: "Джерельце", text: "Мʼяка адаптація, багато обіймів і руху.", color: "bg-sun" },
  { age: "1–3 р.", type: "Малюки", name: "Струмочок", text: "Мʼяка адаптація, багато обіймів і руху.", color: "bg-mint" },
  { age: "1–3 р.", type: "Малюки", name: "Ромашка", text: "Мʼяка адаптація, багато обіймів і руху.", color: "bg-sun" },
  { age: "3–6 р.", type: "Дорослі малюки", name: "Сонечко", text: "Розвиток мовлення й перші творчі проєкти.", color: "bg-mint" },
  { age: "4–6 р.", type: "Дорослі малюки", name: "Калинка", text: "Досліди, спільні ігри, пізнання світу.", color: "bg-sun" },
];

const news = [
  { date: "Щодня", tag: "Батькам", title: "Батьківські двері 24/7", text: "Ми завжди відкриті до спілкування." },
  { date: "Укриття", tag: "Безпека", title: "Наше укриття", text: "Для учасників освітнього процесу укриття працює 24/7." },
  { date: "300 осіб", tag: "Місткість", title: "Безпечний простір", text: "Укриття розраховано на 300 осіб." },
];

const steps = [
  { n: "1", title: "Онлайн запис", text: "Заповніть заявку в системі СЕ ЗДО." },
  { n: "2", title: "Прийняття запрошення", text: "Підтвердьте запрошення до закладу." },
  { n: "3", title: "Надання документів", text: "Заява про зарахування, свідоцтво про народження та медичні документи." },
  { n: "4", title: "Знайомство", text: "Зустріч із вихователем і екскурсія групою." },
];

const gallery = [
  { group: "Джерельце", src: gallery1, alt: "Діти малюють за столом у групі" },
  { group: "Струмочок", src: gallery2, alt: "Діти танцюють і співають у музичній залі" },
  { group: "Ромашка", src: gallery3, alt: "Діти граються на майданчику з гіркою та гойдалками" },
  { group: "Сонечко", src: gallery4, alt: "Обід у садочку: суп, фрукти та молоко" },
  { group: "Калинка", src: aboutImg, alt: "Затишний куточок групи з кубиками та книжками" },
];

function Home() {
  const galleryGroups = ["Усі", ...groups.map((group) => group.name)];
  const [selectedGalleryGroup, setSelectedGalleryGroup] = useState(galleryGroups[0]);
  const visibleGallery =
    selectedGalleryGroup === "Усі"
      ? gallery
      : gallery.filter((item) => item.group === selectedGalleryGroup);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Герой */}
      <section className="grid items-center gap-8 py-10 lg:grid-cols-2 lg:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-md border-2 border-primary-deep bg-sun px-4 py-1.5 font-display text-xs font-bold text-sun-foreground">
            🌻 Набір на 2026/27 відкрито
          </span>
          <h1 className="mt-5 font-display text-4xl leading-tight text-primary-deep sm:text-5xl">
            Садочок, де дитина росте в теплі й дружбі
          </h1>
          <p className="mt-5 max-w-prose text-lg text-muted-foreground">
            ЗДО № 701 — затишний дитячий садочок для малюків від 1 до 6 років. Ігри, творчість,
            музика, прогулянки та смачне домашнє харчування щодня.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/contacts" className="bg-primary text-primary-foreground toy-btn">
              Записати дитину
            </Link>
            <Link to="/groups" className="bg-card text-primary-deep toy-btn">
              Наші групи
            </Link>
          </div>
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
            Світлі просторі групи, безпечний майданчик і вихователі турбуються про дітей кожної
            секунди. Ми поєднуємо гру з навчанням і бережемо дитинство.
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
            <div key={g.name} className="p-5 toy-card toy-hover">
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
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-3xl">Дошка оголошень</h2>
            <span className="font-display text-sm opacity-80">оновлено цього тижня</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
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
          {visibleGallery.map((img) => (
            <div key={`${img.group}-${img.alt}`} className="min-w-[220px] p-2 toy-card toy-hover sm:min-w-[260px]">
              <img
                src={img.src}
                alt={img.alt}
                width={816}
                height={816}
                loading="lazy"
                className="aspect-square w-full rounded-2xl object-cover"
              />
              <p className="mt-3 px-1 font-display text-sm font-bold text-primary-deep">{img.group}</p>
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
                <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
              </div>
            ))}
          </div>
          <Link to="/contacts" className="mt-8 bg-primary text-primary-foreground toy-btn">
            Звʼязатися з нами
          </Link>
        </div>
      </section>
    </main>
  );
}
