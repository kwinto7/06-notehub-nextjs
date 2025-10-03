
'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import { fetchNoteById } from '@/lib/api';
import type { Note } from '@/types/note';
import css from './NoteDetails.module.css';

function formatDateSafe(input?: string | Date): string {
  if (!input) return 'Unknown date';
  const d = new Date(input);
  return isNaN(d.getTime()) ? 'Unknown date' : d.toLocaleString();
}

export default function NoteDetailsClient() {
  const { id } = useParams<{ id: string }>(); 

  const { data: note, isLoading, isError } = useQuery<Note>({
    queryKey: ['note', id],           
    queryFn: () => fetchNoteById(id),  
    placeholderData: (prev) => prev,
    enabled: Boolean(id),           
    retry: false,
    refetchOnMount: false,
  });

  if (isLoading) return <p>Loading, please wait...</p>;
  if (isError || !note) return <p>Something went wrong.</p>;

  return (
    <div className={css.container}>
      <div className={css.item}>
        <div className={css.header}>
          <h2>{note.title}</h2>
        </div>
        <p className={css.content}>{note.content}</p>
        <p className={css.date}>{formatDateSafe(note.createdAt)}</p>
      </div>
    </div>
  );
}

