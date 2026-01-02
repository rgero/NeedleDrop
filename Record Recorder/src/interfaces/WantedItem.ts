import type { User } from "./User";

export interface WantedItem {
  id?: number,
  artist: string,
  album: string,
  imageUrl?: string,
  searcher: User[],
  notes?: string,
  created_at?: Date
}

export interface WantedItemDbPayload extends Omit<Partial<WantedItem>, 'searcher'> {
  searcher?: string[];
}