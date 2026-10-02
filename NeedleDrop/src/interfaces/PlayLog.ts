import type { User } from "./User";

export interface PlayLog {
  id?: number,
  playNumber?: number;
  artist?: string,
  album?: string,
  album_id: number|null,
  listeners: User[],
  date: Date,
  notes?: string,
}

export interface PlaylogDbPayload extends Partial<Pick<PlayLog, 'album_id' | 'notes'>> {
  listeners?: string[];
  date: Date | null;
}

export interface PlaylogDbRow extends Pick<PlayLog, 'id' | 'album_id' | 'notes'> {
  play_number?: number;
  listeners: string[] | null;
  date: string | null;
  vinyls?: { artist: string; album: string } | null;
}