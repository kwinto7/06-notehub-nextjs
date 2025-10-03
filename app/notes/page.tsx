
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

const PER_PAGE = 12;

type Search = Record<string, string | string[] | undefined>;

export default async function NotesPage({
  searchParams,
}: {
  searchParams?: Promise<Search> | Search;
}) {
 
  const sp = typeof (searchParams as any)?.then === 'function'
    ? await (searchParams as Promise<Search>)
    : ((searchParams ?? {}) as Search);

  const rawPage = Array.isArray(sp.page) ? sp.page[0] : sp.page;
  const rawSearch = Array.isArray(sp.search) ? sp.search[0] : sp.search;

  const page = Math.max(1, Number(rawPage ?? 1));
  const search = (rawSearch ?? '').trim();

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

