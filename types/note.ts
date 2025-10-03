export type NoteTag = "Todo" | "Work" | "Personal" | "Meeting" | "Shopping";
export type ISODateString = string & { __iso?: never };

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: ISODateString;
  updatedAt: ISODateString;
}

export interface CreateNoteDto {
  title: string;
  content: string;
  tag: NoteTag;
}