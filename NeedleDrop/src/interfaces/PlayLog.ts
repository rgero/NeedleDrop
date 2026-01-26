import type { User } from "./User";

export interface PlayLog {
  id?: number,
  album_id: number|null,
  listeners: User[],
  date: Date,

  artist?: string,
  album?: string,
  vinyls?: {artist: string, album: string};
}

export interface PlaylogDbPayload extends Omit<Partial<PlayLog>, 'listeners'> {
  listeners?: string[];
}