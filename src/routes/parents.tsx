
import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ZoomImage } from "@/components/zoom-image";

import { groups } from "@/lib/groups";
import { weekdayShortNames } from "@/lib/gallery-rules";

import medical_sister from "@/assets/medical_sister.jpg";
import kid from "@/assets/painting.jpg";
import little_kid from "@/assets/little_kid.jpg";
import playing from "@/assets/playing.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import kitchen from "@/assets/kitchen.jpg";

export const Route = createFileRoute("/parents")({
  head: () => ({
    meta: [
      { title: "Пам’ятка для батьків — ЗДО № 701" },
      {
        name: "description",
        content:
          "Адаптація, харчування, медичне обслуговування, режим дня та оплата у ЗДО № 701.",
      },
      {
        property: "og:title",
        content: "Пам’ятка для батьків — ЗДО № 701",
      },
      {
        property: "og:description",
        content:
          "Адаптація, харчування, медичне обслуговування, режим дня та оплата для родин.",
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
    img: little_kid,
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
    img: playing,
    alt: "Дитячий майданчик із гіркою та гойдалками",
  },
];

const mealPhotos = [
  { meal: "Сніданок", img: kitchen, alt: "Сніданок у садочку" },
  { meal: "Обід", img: kid, alt: "Обід у дитячому садочку" },
  { meal: "Вечеря", img: gallery1, alt: "Вечеря у дитячому садочку" },
];

const medical = [
  {
    title: "Медичний супровід",
    text: "Медична сестра стежить за самопочуттям дітей, дбає про профілактику захворювань і санітарний стан приміщень.",
    img: medical_sister,
    alt: "Приміщення дитячого садочка",
  },
  {
    title: "Здорове харчування",
    text: "Дбаємо про якість і безпечність продуктів, дотримання санітарних норм та організацію повноцінного харчування дітей.",
    img: kitchen,
    alt: "Харчування у дитячому садочку",
  },
];

const routinePhotos = [
  {
    title: "1. Ранковий прийом",
    img: gallery1,
    alt: "Ранкові заняття в групі",
  },
  {
    title: "2. Заняття та творчість",
    img: gallery2,
    alt: "Творчі заняття дітей",
  },
  {
    title: "3. Прогулянка",
    img: gallery3,
    alt: "Прогулянка на майданчику",
  },
  {
    title: "4. Харчування",
    img: kitchen,
    alt: "Харчування у садочку",
  },
];

function Parents() {
  const [selectedMealDay, setSelectedMealDay] = useState(
    weekdays[0] ?? "Понеділок",
  );

  const [selectedRoutineGroup, setSelectedRoutineGroup] = useState(
    groupNames[0] ?? "Джерельце",
  );

  const routineRef = useRef<HTMLDivElement>(null);

  const scrollRoutine = (dir: 1 | -1) => {
    const el = routineRef.current;

    if (el) {
      el.scrollBy({
        left: dir * el.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      {/* Заголовок */}
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">
          Пам’ятка для батьків
        </h1>

        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Усе важливе для родин: адаптація, харчування, медичне
          обслуговування, режим дня та оплата.
        </p>
      </section>

      {/* Адаптація */}
      <section className="pb-14">
        <h2 className="mb-6 font-display text-3xl text-primary-deep">
          Адаптація
        </h2>

        <div className="grid gap-5 md:grid-cols-3">
          {adaptation.map((item) => (
            <article
              key={item.title}
              className="p-3 toy-card toy-hover"
            >
              <ZoomImage
                src={item.img}
                alt={item.alt}
                width={816}
                height={816}
                className="aspect-video w-full rounded-md object-cover"
              />

              <div className="p-3">
                <h3 className="font-display text-lg text-primary-deep">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Харчування */}
      <section className="pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-primary-deep">
            Харчування
          </h2>

          <div className="grid w-full grid-cols-5 gap-2 pb-2 sm:w-auto sm:min-w-[520px]">
            {weekdays.map((day, index) => (
              <Button
                key={day}
                type="button"
                variant={selectedMealDay === day ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMealDay(day)}
                className="w-full border-primary-deep px-1 font-display font-bold"
              >
                <span className="sm:hidden">
                  {weekdayShortNames[index]}
                </span>

                <span className="hidden sm:inline">{day}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-5 toy-card">
          <div className="grid gap-4 md:grid-cols-3">
            {mealPhotos.map((meal) => (
              <article
                key={`${selectedMealDay}-${meal.meal}`}
                className="rounded-md bg-muted p-3"
              >
                <ZoomImage
                  src={meal.img}
                  alt={`${meal.alt}, ${selectedMealDay}`}
                  width={816}
                  height={816}
                  className="aspect-video w-full rounded-md border border-primary-deep object-cover"
                />

                <h3 className="mt-3 font-display text-lg text-primary-deep">
                  {meal.meal}
                </h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Здоров’я та щоденна турбота */}
      <section className="pb-14">
        <h2 className="mb-6 font-display text-3xl text-primary-deep">
          Здоров’я та щоденна турбота
        </h2>

        <div className="grid gap-5 md:grid-cols-2">
          {medical.map((item) => (
            <article
              key={item.title}
              className="grid gap-4 p-4 toy-card sm:grid-cols-[220px_1fr] sm:items-center"
            >
              <ZoomImage
                src={item.img}
                alt={item.alt}
                width={816}
                height={816}
                className="aspect-[4/3] w-full rounded-md object-cover"
              />

              <div>
                <h3 className="font-display text-xl text-primary-deep">
                  {item.title}
                </h3>

                <p className="mt-2 text-base text-muted-foreground">
                  {item.text}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Режим дня */}
      <section className="pb-14">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
          <h2 className="font-display text-3xl text-primary-deep">
            Режим дня
          </h2>

          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {groupNames.map((group) => (
              <Button
                key={group}
                type="button"
                variant={
                  selectedRoutineGroup === group ? "default" : "outline"
                }
                size="sm"
                onClick={() => {
                  setSelectedRoutineGroup(group);
                  routineRef.current?.scrollTo({
                    left: 0,
                    behavior: "smooth",
                  });
                }}
                className="shrink-0 border-primary-deep font-display font-bold"
              >
                {group}
              </Button>
            ))}
          </div>
        </div>

        <div
          ref={routineRef}
          className="flex snap-x gap-5 overflow-x-auto px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Режим дня"
        >
          {routinePhotos.map((step, index) => {
            const photos =
              groups.find((group) => group.name === selectedRoutineGroup)
                ?.photos ?? [];

            const photo =
              photos.length > 0
                ? photos[index % photos.length]
                : undefined;

            return (
              <article
                key={`${selectedRoutineGroup}-${step.title}`}
                className="w-[85%] shrink-0 snap-start overflow-hidden p-2 toy-card sm:w-[28rem] lg:w-[34rem]"
              >
                <ZoomImage
                  src={photo?.src ?? step.img}
                  alt={photo?.alt ?? step.alt}
                  width={816}
                  height={816}
                  className="aspect-video w-full rounded-md object-cover"
                />

                <h3 className="mt-3 font-display text-lg text-primary-deep">
                  {step.title}
                </h3>
              </article>
            );
          })}
        </div>

        <div className="mx-auto flex w-44 justify-between sm:w-60">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Назад"
            title="Назад"
            onClick={() => scrollRoutine(-1)}
            className="rounded-full border-primary-deep bg-card"
          >
            <ArrowLeft />
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Далі"
            title="Далі"
            onClick={() => scrollRoutine(1)}
            className="rounded-full border-primary-deep bg-card"
          >
            <ArrowRight />
          </Button>
        </div>
      </section>

      {/* Оплата */}
      <section className="pb-14">
        <div className="rounded-md border border-primary-deep bg-primary p-6 text-primary-foreground shadow-toy sm:p-8">
          <h2 className="font-display text-2xl">Оплата</h2>

          <p className="mt-3 max-w-prose">
            Оплата за харчування відповідно до наданої квитанції
            адміністрацією відбувається до 20 числа кожного місяця.
          </p>
        </div>
      </section>
    </main>
  );
}
