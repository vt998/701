import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ZoomImage } from "@/components/zoom-image";

import medical_sister from "@/assets/medical_sister.jpg";
import snidanok1 from "@/assets/snidanok1.jpg";
import snidanok2 from "@/assets/snidanok2.jpg";
import snidanok3 from "@/assets/snidanok3.jpg";
import obid1 from "@/assets/obid1.jpg";
import obid2 from "@/assets/obid2.jpg";
import obid3 from "@/assets/obid3.jpg";
import vecherya3 from "@/assets/vecherya1.jpg";
import vecherya2 from "@/assets/vecherya2.jpg";
import vecherya1 from "@/assets/vecherya3.jpg";

import little_kid from "@/assets/little_kid.jpg";
import adaptation_3 from "@/assets/adaptation_3.jpg";
import adaptation_2 from "@/assets/adaptation_2.jpg";
import eda from "@/assets/eda.jpg";
import playing from "@/assets/playing.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
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

function PhotoPlaceholder() {
  return (
    <div className="grid aspect-[4/3] w-full place-items-center rounded-md bg-secondary p-4 text-center font-display text-base font-bold text-primary-deep/70">
      Фото буде додано
    </div>
  );
}

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

// ХАРЧУВАННЯ: тут міняєш кількість фото.
// Щоб додати фото, скопіюй рядок { img: ..., alt: "..." }, – і встав у потрібний список.
// Щоб прибрати, видали рядок. Фото показуються стрічкою з прокруткою (як у галереї).
// Рядок без img (наприклад { alt: "Вечеря" }) показує картку «Фото буде додано».
const meals: { name: string; photos: { img?: string; alt: string }[] }[] = [
  {
    name: "Сніданок",
    photos: [
      { img: snidanok1, alt: "Сніданок у садочку" },
      { img: snidanok2, alt: "Сніданок у садочку" },
      { img: snidanok3, alt: "Сніданок у садочку" },
    ],
  },
  {
    name: "Обід",
    photos: [
      { img: obid1, alt: "Обід у дитячому садочку" },
      { img: obid2, alt: "Обід у дитячому садочку" },
      { img: obid3, alt: "Обід у дитячому садочку" },
    ],
  },
  {
    name: "Вечеря",
    photos: [
      { img: vecherya1, alt: "Вечеря у дитячому садочку" },
      { img: vecherya2, alt: "Вечеря у дитячому садочку" },
      { img: vecherya3, alt: "Вечеря у дитячому садочку" },
    ],
  },
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
    img: eda,
    alt: "Харчування у дитячому садочку",
  },
];

// РЕЖИМ ДНЯ: однакові картки для всіх. Картка без img показує «Фото буде додано».
// Щоб додати картку, скопіюй блок { title, alt, img } і встав у список.
const routinePhotos: { title: string; img?: string; alt: string }[] = [
  {
    title: "1. Заняття та творчість",
    alt: "Творчі заняття дітей",
    img: adaptation_3,
  },
  {
    title: "2. Прогулянка",
    alt: "Прогулянка на майданчику",
    img: adaptation_2,
  },
  {
    title: "3. Харчування",
    alt: "Харчування у садочку",
    img: kitchen,
  },
];

function Parents() {
  const [selectedMeal, setSelectedMeal] = useState(meals[0]?.name ?? "Сніданок");

  const mealPhotos = meals.find((m) => m.name === selectedMeal)?.photos ?? [];

  const mealRef = useRef<HTMLDivElement>(null);

  const scrollMeal = (dir: 1 | -1) => {
    const el = mealRef.current;

    if (el) {
      el.scrollBy({
        left: dir * el.clientWidth * 0.8,
        behavior: "smooth",
      });
    }
  };

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

          <div className="grid w-full grid-cols-3 gap-2 pb-2 sm:w-auto sm:min-w-[380px]">
            {meals.map((meal) => (
              <Button
                key={meal.name}
                type="button"
                variant={selectedMeal === meal.name ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setSelectedMeal(meal.name);
                  mealRef.current?.scrollTo({ left: 0 });
                }}
                aria-pressed={selectedMeal === meal.name}
                className="w-full border-primary-deep px-1 font-display font-bold"
              >
                {meal.name}
              </Button>
            ))}
          </div>
        </div>

        <div
          ref={mealRef}
          className="flex snap-x gap-5 overflow-x-auto px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Фото харчування"
        >
          {mealPhotos.map((photo, index) => (
            <article
              key={`${selectedMeal}-${index}`}
              className="w-[85%] shrink-0 snap-start overflow-hidden p-2 toy-card sm:w-[calc(50%-0.625rem)]"
            >
              {photo.img ? (
                <ZoomImage
                  src={photo.img}
                  alt={photo.alt}
                  width={816}
                  height={816}
                  className="aspect-[4/3] w-full rounded-md object-cover"
                />
              ) : (
                <PhotoPlaceholder />
              )}
            </article>
          ))}
        </div>

        {mealPhotos.length > 1 && (
          <div className="mx-auto flex w-44 justify-between sm:w-60">
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Назад"
              title="Назад"
              onClick={() => scrollMeal(-1)}
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
              onClick={() => scrollMeal(1)}
              className="rounded-full border-primary-deep bg-card"
            >
              <ArrowRight />
            </Button>
          </div>
        )}
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
        <h2 className="mb-6 font-display text-3xl text-primary-deep">
          Режим дня
        </h2>

        <div
          ref={routineRef}
          className="flex snap-x gap-5 overflow-x-auto px-1 pb-4 pt-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Режим дня"
        >
          {routinePhotos.map((step) => (
            <article
              key={step.title}
              className="w-[85%] shrink-0 snap-start overflow-hidden p-2 toy-card sm:w-[calc(50%-0.625rem)]"
            >
              {step.img ? (
                <ZoomImage
                  src={step.img}
                  alt={step.alt}
                  width={816}
                  height={816}
                  className="aspect-[4/3] w-full rounded-md object-cover"
                />
              ) : (
                <PhotoPlaceholder />
              )}

              <h3 className="mt-3 font-display text-lg text-primary-deep">
                {step.title}
              </h3>
            </article>
          ))}
        </div>

        {routinePhotos.length > 1 && (
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
        )}
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