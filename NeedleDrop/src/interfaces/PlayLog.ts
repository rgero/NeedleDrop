import type { User } from "./User";

export interface PlayLog {
  id?: number,
  playNumber?: number;
  album_id: number|null,
  listeners: User[],
  date: Date,
}

export interface PlaylogDbPayload extends Omit<Partial<PlayLog>, 'playNumber' | 'listeners' | 'date'> {
  listeners?: string[];
  date: Date | null;
}