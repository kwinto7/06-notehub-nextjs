
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNoteById } from '@/lib/api';
import NoteDetailsClient from '../NoteDetails.client';
type Params = { id: string };

export default async function NoteDetailsPage({
  params,
}: {
  params: Params | Promise<Params>;
}) {

  const p = typeof (params as any)?.then === 'function'
    ? await (params as Promise<Params>)
    : (params as Params);

  const id = p.id;

  const queryClient = new QueryClient();

await queryClient.prefetchQuery({
  queryKey: ['note', id],
  queryFn: () => fetchNoteById(id),
});

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NoteDetailsClient />
    </HydrationBoundary>
  );
}
