import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAdminSession } from "@/components/admin-session";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Документи — ЗДО № 701" },
      {
        name: "description",
        content: "Офіційні документи ЗДО № 701 — для ознайомлення батьками.",
      },
      { property: "og:title", content: "Документи — ЗДО № 701" },
      {
        property: "og:description",
        content: "Офіційні документи дитячого садочка № 701 у PDF.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Documents,
});

// Шлях, що починається з "/", це файл сайту (public/), інакше файл у сховищі Supabase
const isLocalPath = (path: string) => path.startsWith("/");
const fileUrl = (path: string) =>
  isLocalPath(path) ? path : supabase.storage.from("documents").getPublicUrl(path).data.publicUrl;

function Documents() {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();

  const [creating, setCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("documents")
        .select("*")
        .order("sort_order")
        .order("created_at");

      if (error) throw error;

      return data;
    },
  });

  async function uploadPdf(pdf: File) {
    const extension = pdf.name.toLowerCase().endsWith(".pdf") ? ".pdf" : "";
    const filePath = `${crypto.randomUUID()}${extension}`;

    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(filePath, pdf, { contentType: "application/pdf", upsert: false });

    if (uploadError) throw uploadError;

    return filePath;
  }

  async function addDocument(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim() || !file) {
      setError("Вкажіть назву документа та виберіть PDF-файл.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Можна завантажувати лише PDF-файли.");
      return;
    }

    setBusy(true);
    setError("");

    try {
      const filePath = await uploadPdf(file);

      const { error: insertError } = await supabase.from("documents").insert({
        title: title.trim(),
        description: description.trim() || null,
        file_path: filePath,
        sort_order: Math.max(-1, ...documents.map((d) => d.sort_order)) + 1,
      });

      if (insertError) {
        await supabase.storage.from("documents").remove([filePath]);
        throw insertError;
      }

      setTitle("");
      setDescription("");
      setFile(null);
      setCreating(false);

      const input = window.document.getElementById("document-file") as HTMLInputElement | null;
      if (input) input.value = "";

      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (err) {
      console.error(err);
      setError("Не вдалося додати документ. Спробуйте ще раз.");
    } finally {
      setBusy(false);
    }
  }

  function startEditing(doc: { id: string; title: string; description: string | null }) {
    setEditingId(doc.id);
    setEditTitle(doc.title);
    setEditDescription(doc.description ?? "");
    setEditFile(null);
    setCreating(false);
    setError("");
  }

  function cancelEditing() {
    setEditingId(null);
    setEditFile(null);
    setError("");
  }

  async function saveEdit(event: React.FormEvent<HTMLFormElement>, oldPath: string) {
    event.preventDefault();

    if (!editingId) return;

    if (!editTitle.trim()) {
      setError("Вкажіть назву документа.");
      return;
    }

    if (editFile && editFile.type !== "application/pdf") {
      setError("Можна завантажувати лише PDF-файли.");
      return;
    }

    setBusy(true);
    setError("");

    let newPath: string | null = null;

    try {
      const changes: { title: string; description: string | null; file_path?: string } = {
        title: editTitle.trim(),
        description: editDescription.trim() || null,
      };

      if (editFile) {
        newPath = await uploadPdf(editFile);
        changes.file_path = newPath;
      }

      const { data, error: updateError } = await supabase
        .from("documents")
        .update(changes)
        .eq("id", editingId)
        .select();

      if (updateError) throw updateError;
      if (!data || data.length === 0) throw new Error("Немає прав на зміну документа");

      // Старий файл видаляємо лише якщо він був у сховищі (файли сайту не чіпаємо)
      if (newPath && !isLocalPath(oldPath)) {
        await supabase.storage.from("documents").remove([oldPath]);
      }

      setEditingId(null);
      setEditFile(null);

      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (err) {
      console.error(err);
      if (newPath) await supabase.storage.from("documents").remove([newPath]);
      setError("Не вдалося зберегти зміни. Спробуйте ще раз.");
    } finally {
      setBusy(false);
    }
  }

  async function deleteDocument(id: string, filePath: string) {
    if (!window.confirm("Видалити цей документ?")) return;

    setBusy(true);
    setError("");

    try {
      if (!isLocalPath(filePath)) {
        const { error: storageError } = await supabase.storage
          .from("documents")
          .remove([filePath]);

        if (storageError) throw storageError;
      }

      const { error: deleteError } = await supabase.from("documents").delete().eq("id", id);

      if (deleteError) throw deleteError;

      await queryClient.invalidateQueries({ queryKey: ["documents"] });
    } catch (err) {
      console.error(err);
      setError("Не вдалося видалити документ. Спробуйте ще раз.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="mx-auto max-w-6xl px-4 sm:px-6">
      <section className="py-10">
        <h1 className="font-display text-4xl text-primary-deep sm:text-5xl">Документи</h1>

        <p className="mt-4 max-w-prose text-lg text-muted-foreground">
          Офіційні документи закладу — можна відкрити або завантажити у форматі PDF.
        </p>
      </section>

      <section className="pb-14">
        <div className="mb-6">
          <h2 className="font-display text-2xl text-primary-deep">Установчі документи</h2>

          {admin && !creating && (
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setCreating(true);
                  setEditingId(null);
                  setError("");
                }}
              >
                <Plus />
                Додати документ
              </Button>
            </div>
          )}
        </div>

        {admin && creating && (
          <form onSubmit={addDocument} className="mb-6 max-w-xl space-y-3 rounded-lg p-5 toy-card">
            <h3 className="font-display text-xl text-primary-deep">Новий документ</h3>

            <Input
              placeholder="Назва документа"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <Textarea
              placeholder="Короткий опис"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <div>
              <label htmlFor="document-file" className="mb-2 block text-sm font-medium">
                PDF-файл
              </label>

              <Input
                id="document-file"
                type="file"
                accept="application/pdf,.pdf"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex flex-wrap gap-2">
              <Button type="submit" disabled={busy}>
                {busy ? "Завантаження..." : "Додати документ"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={busy}
                onClick={() => {
                  setCreating(false);
                  setTitle("");
                  setDescription("");
                  setFile(null);
                  setError("");
                }}
              >
                Скасувати
              </Button>
            </div>
          </form>
        )}

        {error && !creating && !editingId && (
          <p className="mb-4 text-sm text-destructive">{error}</p>
        )}

        {isLoading ? (
          <p className="text-muted-foreground">Завантаження...</p>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {documents.map((doc, index) => {
              const isLastCentered =
                documents.length >= 3 &&
                documents.length % 2 === 1 &&
                index === documents.length - 1;

              const url = fileUrl(doc.file_path);

              return (
                <li
                  key={doc.id}
                  className={`min-w-0 p-5 toy-card ${
                    isLastCentered
                      ? "md:col-span-2 md:w-[calc(50%-0.5rem)] md:justify-self-center"
                      : ""
                  }`}
                >
                  {admin && editingId === doc.id ? (
                    <form
                      onSubmit={(event) => saveEdit(event, doc.file_path)}
                      className="space-y-3"
                    >
                      <Input
                        aria-label="Назва документа"
                        placeholder="Назва документа"
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                      />

                      <Textarea
                        aria-label="Короткий опис"
                        placeholder="Короткий опис"
                        value={editDescription}
                        onChange={(event) => setEditDescription(event.target.value)}
                      />

                      <div>
                        <label className="mb-2 block text-sm font-medium">
                          Замінити PDF (необов’язково)
                        </label>

                        <Input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={(event) => setEditFile(event.target.files?.[0] ?? null)}
                        />
                      </div>

                      {error && <p className="text-sm text-destructive">{error}</p>}

                      <div className="flex flex-wrap gap-2">
                        <Button type="submit" disabled={busy}>
                          {busy ? "Збереження..." : "Зберегти"}
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          disabled={busy}
                          onClick={cancelEditing}
                        >
                          Скасувати
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-start gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-md border-2 border-primary-deep bg-sun font-display text-[11px] font-bold text-sun-foreground">
                        PDF
                      </span>

                      <div className="min-w-0 flex-1">
                        <a
                          href={url}
                          target="_blank"
                          rel="noreferrer"
                          className="break-words font-display text-lg font-bold text-primary-deep underline decoration-2 underline-offset-4"
                        >
                          {doc.title}
                        </a>

                        {doc.description && (
                          <p className="mt-1 whitespace-pre-wrap break-words text-sm text-muted-foreground">
                            {doc.description}
                          </p>
                        )}

                        <div className="mt-3 flex flex-wrap gap-2">
                          <a
                            href={url}
                            download
                            className="inline-flex bg-primary text-primary-foreground toy-btn"
                          >
                            Завантажити
                          </a>

                          {admin && (
                            <>
                              <Button
                                type="button"
                                variant="outline"
                                disabled={busy}
                                onClick={() => startEditing(doc)}
                              >
                                <Pencil />
                                Змінити
                              </Button>

                              <Button
                                type="button"
                                variant="outline"
                                disabled={busy}
                                onClick={() => deleteDocument(doc.id, doc.file_path)}
                              >
                                <Trash2 />
                                Видалити
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}