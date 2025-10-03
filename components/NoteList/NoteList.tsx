import Link from 'next/link';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { Note } from '../../types/note';
import { deleteNote } from '@/lib/api';
import css from './NoteList.module.css';

export interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();

  // Видалення нотатки з інвалідацією всіх списків нотаток
  const deleteMut = useMutation<unknown, Error, string>({
    mutationFn: (id) => deleteNote(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
  });

  const handleDeleteClick =
    (id: string) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!deleteMut.isPending) deleteMut.mutate(id);
    };

  const deletingId =
    typeof deleteMut.variables === 'string' ? deleteMut.variables : undefined;

  return (
    <ul className={css.list}>
      {notes.map((n) => {
        const id = String(n.id); // підтримка number|string
        return (
          <li key={id} className={css.listItem}>
            <h2 className={css.title}>{n.title}</h2>
            <p className={css.content}>{n.content}</p>

            <div className={css.footer}>
              <span className={css.tag}>{n.tag}</span>

              {/* 👉 Посилання на сторінку деталей перед Delete */}
              <Link href={`/notes/${id}`} className={css.link} aria-label={`View details of ${n.title}`}>
                View details
              </Link>

              <button
                className={css.button}
                onClick={handleDeleteClick(id)}
                disabled={deletingId === id && deleteMut.isPending}
              >
                {deletingId === id && deleteMut.isPending ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
