import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/groups")({
  head: () => ({
    meta: [
      { title: "Групи — ЗДО № 701" },
      {
        name: "description",
        content: "Групи ЗДО № 701 для дітей від 1,5 до 6 років: вік, кількість дітей і заняття.",
      },
      { property: "og:title", content: "Групи — ЗДО № 701" },
      {
        property: "og:description",
        content: "Вік, наповнюваність і заняття в кожній групі дитячого садочка № 701.",
      },
    ],
  }),
  component: Groups;
});

function Groups() {
  return null;
}
