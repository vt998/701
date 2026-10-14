import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, RotateCcw, Check, X } from 'lucide-react';
import { useAdminSession } from './admin-session';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { kidsGroupsTable, useGroups, type Group } from '@/lib/use-groups';

const colors = [
  { value: 'bg-sun', label: 'Жовтий' },
  { value: 'bg-mint', label: 'М’ятний' },
  { value: 'bg-secondary', label: 'Світлий' },
];

type Form = { name: string; age: string; type: string; description: string; color: string };
const emptyForm: Form = { name: '', age: '', type: '', description: '', color: 'bg-sun' };

export function GroupAdmin() {
  const { admin } = useAdminSession();
  const queryClient = useQueryClient();
  const groups = useGroups();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Group | null>(null);
  const [form, setForm] = useState<Form>(emptyForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (!admin) return null;

  const set = (key: keyof Form) => (value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  function startNew() {
    setEditing(null);
    setForm(emptyForm);
    setError('');
    setOpen(true);
  }

  function startEdit(g: Group) {
    setEditing(g);
    setForm({ name: g.name, age: g.age, type: g.type, description: g.text, color: g.color });
    setError('');
    setOpen(true);
  }

  function close() {
    setOpen(false);
    setEditing(null);
    setForm(emptyForm);
  }

  async function run(work: () => Promise<void>, fail: string) {
    setBusy(true);
    setError('');
    try {
      await work();
      await queryClient.invalidateQueries({ queryKey: ['kids-groups'] });
    } catch (e) {
      console.error(e);
      setError(fail);
    } finally {
      setBusy(false);
    }
  }

  function save() {
    if (!form.name.trim()) return;
    const values = {
      name: form.name.trim(),
      age: form.age.trim(),
      type: form.type.trim(),
      description: form.description.trim(),
      color: form.color,
    };
    void run(async () => {
      if (editing?.rowId) {
        const { error } = await kidsGroupsTable().update(values).eq('id', editing.rowId);
        if (error) throw error;
      } else if (editing) {
        const { error } = await kidsGroupsTable().insert({ slug: editing.slug, sort_order: 0, ...values });
        if (error) throw error;
      } else {
        const { error } = await kidsGroupsTable().insert({
          slug: `g-${crypto.randomUUID().slice(0, 8)}`,
          sort_order: groups.filter((g) => g.custom).length,
          ...values,
        });
        if (error) throw error;
      }
      close();
    }, 'Не вдалося зберегти групу. Спробуйте ще раз.');
  }

  function remove(g: Group) {
    if (!g.rowId) return;
    const text = g.custom
      ? 'Видалити групу? Її фото в галереї зникнуть із сайту.'
      : 'Скинути зміни й повернути початкові дані групи?';
    if (!window.confirm(text)) return;
    void run(async () => {
      const { error } = await kidsGroupsTable().delete().eq('id', g.rowId);
      if (error) throw error;
    }, 'Не вдалося виконати дію.');
  }

  return (
    <div className="mt-6 space-y-4">
      {!open && (
        <Button variant="outline" onClick={startNew}>
          <Plus />Додати групу
        </Button>
      )}
      {open && (
        <form
          className="grid gap-3 p-5 toy-card sm:grid-cols-2"
          onSubmit={(e) => {
            e.preventDefault();
            save();
          }}
        >
          <h3 className="font-display text-xl text-primary-deep sm:col-span-2">
            {editing ? `Редагування: ${editing.name}` : 'Нова група'}
          </h3>
          <Input aria-label="Назва групи" placeholder="Назва групи" value={form.name} onChange={(e) => set('name')(e.target.value)} required maxLength={100} className="sm:col-span-2" />
          <Input aria-label="Вік" placeholder="Вік (наприклад, 3–4 роки)" value={form.age} onChange={(e) => set('age')(e.target.value)} maxLength={50} />
          <Input aria-label="Тип" placeholder="Тип (наприклад, Середня група)" value={form.type} onChange={(e) => set('type')(e.target.value)} maxLength={100} />
          <Input aria-label="Опис" placeholder="Короткий опис" value={form.description} onChange={(e) => set('description')(e.target.value)} maxLength={300} className="sm:col-span-2" />
          <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
            <span className="text-sm text-muted-foreground">Колір мітки:</span>
            {colors.map((c) => (
              <Button key={c.value} type="button" size="sm" variant={form.color === c.value ? 'default' : 'outline'} aria-pressed={form.color === c.value} onClick={() => set('color')(c.value)}>
                <span className={`size-3 rounded-full border border-primary-deep ${c.value}`} />
                {c.label}
              </Button>
            ))}
          </div>
          <div className="flex gap-2 sm:col-span-2">
            <Button type="submit" disabled={busy || !form.name.trim()}><Check />Зберегти</Button>
            <Button type="button" variant="outline" onClick={close}><X />Скасувати</Button>
          </div>
        </form>
      )}
      <ul className="flex flex-wrap gap-2">
        {groups.map((g) => (
          <li key={g.slug} className="flex items-center gap-1 rounded-md border border-primary-deep bg-card py-1 pl-3 pr-1 text-sm">
            {g.name}
            <Button type="button" size="icon" variant="ghost" disabled={busy} aria-label={`Редагувати групу ${g.name}`} title="Редагувати" onClick={() => startEdit(g)}>
              <Pencil />
            </Button>
            {g.custom && (
              <Button type="button" size="icon" variant="ghost" disabled={busy} aria-label={`Видалити групу ${g.name}`} title="Видалити групу" onClick={() => remove(g)}>
                <Trash2 />
              </Button>
            )}
            {!g.custom && g.overridden && (
              <Button type="button" size="icon" variant="ghost" disabled={busy} aria-label={`Скинути зміни групи ${g.name}`} title="Скинути до початкових" onClick={() => remove(g)}>
                <RotateCcw />
              </Button>
            )}
          </li>
        ))}
      </ul>
      {error && <p role="alert" className="text-destructive">{error}</p>}
    </div>
  );
}