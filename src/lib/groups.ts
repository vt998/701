import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";

export type GroupPhoto = { src: string; alt: string };

export type Group = {
  slug: string;
  name: string;
  type: string;
  age: string;
  text: string;
  activities: string[];
  color: string;
  photos: GroupPhoto[];
};

export const galleryImages: GroupPhoto[] = [
  { src: gallery1, alt: "Діти малюють за столом у групі" },
  { src: gallery2, alt: "Діти танцюють і співають у музичній залі" },
  { src: gallery3, alt: "Діти граються на майданчику" },
  { src: gallery4, alt: "Діти обідають у садочку" },
];

function rotate(list: GroupPhoto[], offset: number): GroupPhoto[] {
  return list.map((_, i) => list[(i + offset) % list.length]!);
}

export const groups: Group[] = [
  {
    slug: "dzhereltse",
    name: "Джерельце",
    type: "Малюки",
    age: "1–3 роки",
    text: "Мʼяка адаптація, сенсорні ігри, багато руху та обіймів.",
    activities: ["Сенсорика", "Пальчикові ігри", "Музичні хвилинки"],
    color: "bg-sun",
    photos: rotate(galleryImages, 0),
  },
  {
    slug: "strumochok",
    name: "Струмочок",
    type: "Малюки",
    age: "1–3 роки",
    text: "Мʼяка адаптація, багато обіймів і руху.",
    activities: ["Рухливі ігри", "Малювання", "Ліплення"],
    color: "bg-mint",
    photos: rotate(galleryImages, 1),
  },
  {
    slug: "romashka",
    name: "Ромашка",
    type: "Малюки",
    age: "1–3 роки",
    text: "Мʼяка адаптація, багато обіймів і руху.",
    activities: ["Казки", "Природа", "Хореографія"],
    color: "bg-sun",
    photos: rotate(galleryImages, 2),
  },
  {
    slug: "sonechko",
    name: "Сонечко",
    type: "Дорослі малюки",
    age: "3–6 років",
    text: "Розвиток мовлення й перші творчі проєкти.",
    activities: ["Мовлення", "Творчість", "Музика"],
    color: "bg-mint",
    photos: rotate(galleryImages, 3),
  },
  {
    slug: "kalynka",
    name: "Калинка",
    type: "Дорослі малюки",
    age: "4–6 років",
    text: "Досліди, спільні ігри, пізнання світу.",
    activities: ["Досліди", "Лічба", "Логіка"],
    color: "bg-mint",
    photos: rotate(galleryImages, 4),
  },
];

export type GalleryCategory = "Заняття" | "Дозвілля" | "Свята";

export type GalleryGroup = {
  name: string;
  photos: Record<GalleryCategory, GroupPhoto[]>;
};

export const galleryData: GalleryGroup[] = [
  {
    name: "Ранній розвиток",
    photos: {
      "Заняття": [galleryImages[0]!],
      "Дозвілля": [galleryImages[1]!],
      "Свята": [galleryImages[2]!],
    },
  },
  {
    name: "Дошкільна підготовка",
    photos: {
      "Заняття": [galleryImages[3]!],
      "Дозвілля": [galleryImages[0]!],
      "Свята": [galleryImages[1]!],
    },
  },
  {
    name: "Творчість",
    photos: {
      "Заняття": [galleryImages[2]!],
      "Дозвілля": [galleryImages[3]!],
      "Свята": [galleryImages[0]!],
    },
  },
  {
    name: "Англійська мова",
    photos: {
      "Заняття": [galleryImages[1]!],
      "Дозвілля": [galleryImages[2]!],
      "Свята": [galleryImages[3]!],
    },
  },
  {
    name: "Спорт",
    photos: {
      "Заняття": [galleryImages[0]!],
      "Дозвілля": [galleryImages[1]!],
      "Свята": [galleryImages[2]!],
    },
  },
];
