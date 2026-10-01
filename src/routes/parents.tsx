import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ZoomImage } from "@/components/zoom-image";
import { groups } from "@/lib/groups";

import aboutImg from "@/assets/about-classroom.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "Пам’ятка для батьків — ЗДО № 701" },
      {
        name: "description",
        content: "Адаптація, харчування, медичне обслуговування, режим дня та оплата у ЗДО № 701.",
      },
      { property: "og:title", content: "Пам’ятка для батьків — ЗДО № 701" },
      {
        property: "og:description",
        content: "Адаптація, харчування, медичне обслуговування, режим дня та оплата для родин.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Parents,
});

const groupNames = ["Джерельце", "Струмочок", "Ромашка", "Сонечко", "Калинка"];

const weekdays = ["Понеділок", "Вівторок", "Середа", "Четвер", "П’ятниця"];

const adaptation = [
  {
    title: "Перші спокійні ранки",
    text: "Дитина поступово знайомиться з вихователем, групою та новими друзями.",
    img: gallery1,
    alt: "Діти малюють за столом у групі",
  },
  {
    title: "Гра замість хвилювання",
    text: "Через рухливі ігри, казки й творчість малюки легше звикають до садочка.",
    img: gallery2,
    alt: "Діти співають і танцюють у музичній залі",
  },
  {
    title: "Прогулянки та дружба",
    text: "Багато свіжого повітря, підтримки й маленьких перемог щодня.",
    img: gallery3,
    alt: "Дитячий майданчик із гіркою та гойдалками",
  },
];

const mealPhotos = [
  { meal: "Сніданок", img: gallery4, alt: "Сніданок у садочку" },
  { meal: "Обід", img: aboutImg, alt: "Обід у дитячому садочку" },
  { meal: "Вечеря", img: gallery1, alt: "Вечеря у дитячому садочку" },
];

const medical = [
  {
    title: "Щоденна турбота",
    text: "Медична сестра стежить за самопочуттям дітей і санітарним станом приміщень.",
    img: aboutImg,
    alt: "Світлий куточок групи для спокійних занять",
  },
  {
    title: "Профілактика та підтримка",
    text: "Після хвороби приймаємо довідку та допомагаємо дитині комфортно повернутися у групу.",
    img: gallery2,
    alt: "Діти на музичному занятті",
  },
];

const routinePhotos = [
  { title: "1. Ранковий прийом", img: gallery1, alt: "Ранкові заняття в групі" },
  { title: "2. Заняття та творчість", img: gallery2, alt: "Творчі заняття дітей" },
  { title: "3. Прогулянка", img: gallery3, alt: "Прогулянка на майданчику" },
  { title: "4. Харчування", img: gallery4, alt: "Харчування у садочку" },
];

function Parents() {
  const [selectedMealDay, setSelectedMealDay] = useState(weekdays[0]!);
  const [selectedRoutineGroup, setSelectedRoutineGroup] = useState(groupNames[0]!);

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Пам’ятка для батьків</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Усе важливе для родин: адаптація, харчування, медичне обслуговування, режим дня та оплата.
        </p>
      </section>

      <section className="pb-14">
        <h2 className="mb-6 font-display text-3xl text-primary-deep">Адаптація</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {adaptation.map((item) => (
            <article key={item.title} className="p-3 toy-card toy-hover">
              <ZoomImage
                src={item.img}
                alt={item.alt}
                width={816}
                height={816}
                className="aspect-square w-full rounded-md object-cover"
              />
              <div className="p-3">
                <h3 className="font-display text-lg text-primary-deep">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-primary-deep">Харчування</h2>
          <div className="grid w-full grid-cols-5 gap-2 pb-2 sm:w-auto sm:min-w-[520px]">
            {weekdays.map((day) => (
              <Button
                key=<span className="sm:hidden">{day.slice(0, 2)}</span>
                <span className="hidden sm:inline">{day}</span>
                type="button"
                variant={selectedMealDay === day ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMealDay(day)}
                className="w-full border-primary-deep px-1 font-display font-bold"
              >
                {day}
              </Button>
            ))}
          </div>
        </div>
        <div className="p-5 toy-card">
          <p className="font-display text-xl text-primary-deep">{selectedMealDay}</p>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {mealPhotos.map((meal) => (
              <article key={`${selectedMealDay}-${meal.meal}`} className="rounded-md bg-muted p-3">
                <ZoomImage
                  src={meal.img}
                  alt={`${meal.alt}, ${selectedMealDay}`}
                  width={816}
                  height={816}
                  className="aspect-square w-full rounded-md border border-primary-deep object-cover"
                />
                <h3 className="mt-3 font-display text-lg text-primary-deep">{meal.meal}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-14">
        <h2 className="mb-6 font-display text-3xl text-primary-deep">Медичне обслуговування</h2>
        <div className="grid gap-5 md:grid-cols-2">
          {medical.map((item) => (
            <article key={item.title} className="grid gap-4 p-4 toy-card sm:grid-cols-[180px_1fr]">
              <ZoomImage
                src={item.img}
                alt={item.alt}
                width={816}
                height={816}
                className="aspect-square w-full rounded-md object-cover"
              />
              <div>
                <h3 className="font-display text-xl text-primary-deep">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-primary-deep">Режим дня</h2>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {groupNames.map((group) => (
              <Button
                key={group}
                type="button"
                variant={selectedRoutineGroup === group ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRoutineGroup(group)}
                className="shrink-0 border-primary-deep font-display font-bold"
              >
                {group}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {routinePhotos.map((step, i) => {
            const photos = groups.find((g) => g.name === selectedRoutineGroup)?.photos ?? [];
            const photo = photos[i % Math.max(photos.length, 1)];
            return (
            <article
              key={`${selectedRoutineGroup}-${step.title}`}
              className="min-w-[230px] p-3 toy-card toy-hover sm:min-w-[280px]"
            >
              <ZoomImage
                src={photo?.src ?? step.img}
                alt={photo?.alt ?? step.alt}
                width={816}
                height={816}
                className="aspect-square w-full rounded-md object-cover"
              />
              <h3 className="mt-3 font-display text-lg text-primary-deep">{step.title}</h3>
            </article>
            );
          })}
        </div>
      </section>

      <section className="pb-14">
        <div className="rounded-md border border-primary-deep bg-primary p-6 text-primary-foreground shadow-toy sm:p-8">
          <h2 className="font-display text-2xl">Оплата</h2>
          <p className="mt-3 max-w-prose">
            Оплата за харчування відповідно до наданої квитанції адміністрацією відбувається до 20
            числа кожного місяця.
          </p>
        </div>
      </section>
    </main>
  );
}
