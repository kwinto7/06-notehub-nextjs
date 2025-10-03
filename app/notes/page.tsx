// app/notes/page.tsx
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const PER_PAGE = 12;

type Search = {
  page?: string;
  search?: string;
};

export default async function NotesPage({
  searchParams,
}: {
  searchParams: Promise<Search>;
}) {
  const sp = await searchParams;

  const page = Math.max(1, Number(sp.page ?? 1));
  const search = (sp.search ?? '').trim();

  const queryClient = new QueryClient();
  const queryKey = ['notes', { page, perPage: PER_PAGE, search }] as const;

  await queryClient.prefetchQuery({
    queryKey,
    queryFn: () => fetchNotes({ page, perPage: PER_PAGE, search }),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialPage={page} initialSearch={search} />
    </HydrationBoundary>
  );
}


