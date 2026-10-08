import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ImagePlus, Plus, Trash2 } from "lucide-react";

import aboutImg from "@/assets/about-classroom.jpg";
import gallery1 from "@/assets/gallery-1.jpg";
import gallery2 from "@/assets/gallery-2.jpg";
import gallery3 from "@/assets/gallery-3.jpg";
import gallery4 from "@/assets/gallery-4.jpg";
import { ZoomImage } from "@/components/zoom-image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminSession } from "@/components/admin-session";
import { supabase } from "@/integrations/supabase/client";
import { isAllowedImage, moveItem } from "@/lib/photo-rules";

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

const placeholders = [aboutImg, gallery1, gallery2, gallery3, gallery4];
type Member = { id: string; position: string; name: string; storage_path: string | null; sort_order: number; src: string };

function Team() {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [drag, setDrag] = useState<number | null>(null);
  const { data: members = [], isLoading } = useQuery({ queryKey: ["team"], queryFn: async (): Promise<Member[]> => {
    const { data, error } = await supabase.from("team_members").select("*").order("sort_order").order("created_at");
    if (error) throw error;
    return Promise.all((data ?? []).map(async (m, i) => {
      let src = placeholders[i % placeholders.length] ?? aboutImg;
      if (m.storage_path) { const { data: u } = await supabase.storage.from("site-photos").createSignedUrl(m.storage_path, 3600); if (u) src = u.signedUrl; }
      return { ...m, src };
    }));
  } });

  async function run(work: () => Promise<void>) {
    setBusy(true); setError("");
    try { await work(); await queryClient.invalidateQueries({ queryKey: ["team"] }); }
    catch (e) { console.error(e); setError(e instanceof Error && e.message === "file" ? "Оберіть JPG, PNG або WEBP до 10 МБ." : "Не вдалося зберегти зміни. Спробуйте ще раз."); }
    finally { setBusy(false); }
  }
  const update = (id: string, values: Partial<Pick<Member, "name" | "position" | "storage_path" | "sort_order">>) => run(async () => { const { error } = await supabase.from("team_members").update(values).eq("id", id); if (error) throw error; });
  const add = () => run(async () => { const { error } = await supabase.from("team_members").insert({ sort_order: members.length }); if (error) throw error; });
  const remove = (m: Member) => { if (window.confirm("Видалити цю картку?")) void run(async () => { const { error } = await supabase.from("team_members").delete().eq("id", m.id); if (error) throw error; if (m.storage_path) await supabase.storage.from("site-photos").remove([m.storage_path]); }); };
  const setPhoto = (m: Member, file?: File) => file && run(async () => {
    if (!isAllowedImage(file.type, file.size)) throw new Error("file");
    const path = `team/${crypto.randomUUID()}.${file.type === "image/jpeg" ? "jpg" : file.type.split("/")[1]}`;
    const { error: up } = await supabase.storage.from("site-photos").upload(path, file, { contentType: file.type });
    if (up) throw up;
    const { error } = await supabase.from("team_members").update({ storage_path: path }).eq("id", m.id);
    if (error) throw error;
    if (m.storage_path) await supabase.storage.from("site-photos").remove([m.storage_path]);
  });
  const drop = (target: number) => {
    if (drag === null || drag === target) return setDrag(null);
    const list = moveItem(members, drag, target); setDrag(null);
    void run(async () => { for (const [i, m] of list.entries()) if (m.sort_order !== i) { const { error } = await supabase.from("team_members").update({ sort_order: i }).eq("id", m.id); if (error) throw error; } });
  };

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Наш колектив</h1>
        <p className="mt-4 max-w-prose text-lg text-muted-foreground">Люди, які щодня створюють для дітей турботливе, безпечне та цікаве середовище.</p>
        {admin && <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button disabled={busy} onClick={() => void add()}><Plus />Додати працівника</Button>
          <span className="text-sm text-muted-foreground">Перетягуйте картки, щоб змінити порядок. Посаду та ім’я можна виправити просто в картці.</span>
          {error && <p role="alert" className="w-full text-destructive">{error}</p>}
        </div>}
      </section>
      {isLoading && <p role="status" className="pb-10">Завантаження…</p>}
      <section className="grid gap-5 pb-14 sm:grid-cols-2 lg:grid-cols-3">
        {members.map((m, index) => (
          <article key={m.id} draggable={admin} onDragStart={() => setDrag(index)} onDragOver={e => admin && e.preventDefault()} onDrop={() => drop(index)}
            className={`overflow-hidden toy-card ${admin ? "cursor-grab" : "toy-hover"} ${drag === index ? "opacity-50" : ""}`}>
            {admin ? <Input className="m-2 w-[calc(100%-1rem)] font-display text-sm font-bold" aria-label="Посада" defaultValue={m.position} onBlur={e => e.target.value !== m.position && void update(m.id, { position: e.target.value })} />
              : <p className="p-4 font-display text-sm font-bold text-accent">{m.position}</p>}
            <ZoomImage src={m.src} alt={`Фото: ${m.position}`} width={640} height={640} className="aspect-square w-full border-y border-primary-deep bg-muted object-cover" />
            {admin ? <div className="space-y-2 p-2">
              <Input aria-label="Ім’я та прізвище" defaultValue={m.name} onBlur={e => e.target.value !== m.name && void update(m.id, { name: e.target.value })} />
              <div className="flex gap-2"><PhotoButton disabled={busy} onFile={f => void setPhoto(m, f)} /><Button size="sm" variant="destructive" disabled={busy} onClick={() => remove(m)}><Trash2 />Видалити</Button></div>
            </div> : <h2 className="p-4 font-display text-xl text-primary-deep">{m.name}</h2>}
          </article>
        ))}
      </section>
    </main>
  );
}

function PhotoButton({ onFile, disabled }: { onFile: (f?: File) => void; disabled: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  return <>
    <input ref={ref} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={e => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
    <Button size="sm" variant="outline" className="flex-1" disabled={disabled} onClick={() => ref.current?.click()}><ImagePlus />Змінити фото</Button>
  </>;
}
