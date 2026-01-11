import type { User } from "./User";

export interface PlayLog {
  id?: number,
  artist: string,
  album: string,
  listeners: User[],
  date: Date
}

export interface PlaylogDbPayload extends Omit<Partial<PlayLog>, 'listeners'> {
  listeners?: string[];
}