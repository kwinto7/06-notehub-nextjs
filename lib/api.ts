import axios from "axios";
import type { Note, CreateNoteDto } from "../types/note";

const NOTEHUB_API = "https://notehub-public.goit.study/api";
const TOKEN = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN as string | undefined;

if (!TOKEN) throw new Error("Missing NEXT_PUBLIC_NOTEHUB_TOKEN env variable");

const http = axios.create({
  baseURL: NOTEHUB_API,
  headers: { Authorization: `Bearer ${TOKEN}` },
});

interface ApiErrorPayload {
  message?: string;
  error?: string;
  errors?: string[];
  statusCode?: number;
}

export function toReadableError(err: unknown): Error {
  if (axios.isAxiosError<ApiErrorPayload>(err)) {
    const s = err.response?.status;
    const p = err.response?.data;
    const msg = p?.message || p?.error || p?.errors?.[0] || err.message || "Request failed";
    return new Error(`NoteHub error${s ? " " + s : ""}: ${msg}`);
  }
  if (err instanceof Error) return new Error(`NoteHub error: ${err.message}`);
  return new Error("NoteHub error: Unknown error");
}

export interface FetchNotesParams {
  page?: number;     // 1..N
  perPage?: number;  // напр. 12
  search?: string;   // строка поиска
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

function compactParams<T extends object>(obj: T): Partial<T> {
  const out = {} as Partial<T>;
  (Object.entries(obj) as [keyof T, T[keyof T]][]).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') {
      out[k] = v;
    }
  });
  return out;
}

export async function fetchNotes(params: FetchNotesParams): Promise<FetchNotesResponse> {
  try {
    const { data } = await http.get<FetchNotesResponse>("/notes", {
      params: compactParams(params),
    });
    return data;
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function createNote(dto: CreateNoteDto): Promise<Note> {
  try {
    const { data } = await http.post<Note>("/notes", dto);
    return data;
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function deleteNote(id: string): Promise<Note> {
  try {
    const { data } = await http.delete<Note>(`/notes/${id}`);
    return data;
  } catch (err) {
    throw toReadableError(err);
  }
}

export async function fetchNoteById(id: number | string): Promise<Note> {
  try {
    const { data } = await http.get<Note>(`/notes/${id}`);
    return data;
  } catch (err) {
    throw toReadableError(err);
  }
}