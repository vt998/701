import { createFileRoute } from "@tanstack/react-router";

import aboutImg from "@/assets/about-classroom.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Про заклад — ЗДО № 701" },
      {
        name: "description",
        content: "Про дитячий садочок № 701: умови, режим дня, харчування та команда педагогів.",
      },
      { property: "og:title", content: "Про заклад — ЗДО № 701" },
      {
        property: "og:description",
        content: "Умови, режим дня, харчування та команда педагогів ЗДО № 701.",
      },
    ],
  }),
  component: About,
});

const schedule = [
  ["7:30 – 8:30", "Прийом дітей, ранкова гімнастика"],
  ["8:40 – 9:00", "Сніданок"],
  ["9:00 – 10:30", "Заняття: мовлення, лічба, творчість"],
  ["10:30 – 12:00", "Прогулянка та рухливі ігри"],
  ["12:15 – 13:00", "Обід"],
  ["13:00 – 15:00", "Денний сон"],
  ["15:20 – 16:00", "Полуденок, гуртки"],
  ["16:00 – 18:30", "Ігри, прогулянка, зустріч батьків"],
];

const team = [
  { name: "Директор", role: "керує закладом, приймає документи" },
  { name: "Вихователі", role: "12 педагогів у групах" },
  { name: "Музичний керівник", role: "заняття музикою та свята" },
  { name: "Логопед", role: "індивідуальні заняття з мовлення" },
  { name: "Практичний психолог", role: "адаптація та підтримка" },
  { name: "Медична сестра", role: "щоденний огляд і контроль меню" },
];

function About() {
  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="grid items-center gap-8 py-10 lg:grid-cols-2">
        <div>
          <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Про наш заклад</h1>
          <p className="mt-5 max-w-prose text-lg text-muted-foreground">
            ЗДО № 701 — комунальний заклад дошкільної освіти. У нас 12 груп для дітей від 1,5 до 6
            років, власний зелений двір, музична та спортивна зали.
          </p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              ["12", "груп"],
              ["280", "дітей"],
              ["30", "працівників"],
            ].map(([num, label]) => (
              <div key={label} className="p-4 text-center toy-card">
                <p className="font-display text-2xl font-bold text-primary">{num}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="p-3 toy-card">
          <img
            src={aboutImg}
            alt="Куточок групи з кубиками, книжками та подушками"
            width={1024}
            height={1200}
            className="w-full rounded-2xl"
          />
        </div>
      </section>

      <section className="pb-14">
        <h2 className="mb-6 font-display text-3xl text-primary-deep">Режим дня</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {schedule.map(([time, what]) => (
            <div key={time} className="flex items-center gap-4 p-4 toy-card">
              <span className="shrink-0 rounded-md border-2 border-primary-deep bg-mint px-3 py-1 font-display text-xs font-bold text-primary-deep">
                {time}
              </span>
              <span className="text-sm">{what}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <h2 className="mb-6 font-display text-3xl text-primary-deep">Наша команда</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((t) => (
            <div key={t.name} className="p-5 toy-card toy-hover">
              <h3 className="font-display text-lg text-primary-deep">{t.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t.role}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <div className="p-6 toy-card sm:p-8">
          <h2 className="font-display text-3xl text-primary-deep">Харчування</h2>
          <p className="mt-4 max-w-prose text-muted-foreground">
            Готуємо на власній кухні: пʼять прийомів їжі щодня, сезонні овочі та фрукти, страви без
            напівфабрикатів. Меню на тиждень щоразу вивішуємо в холі та в групах.
          </p>
        </div>
      </section>
    </main>
  );
}
