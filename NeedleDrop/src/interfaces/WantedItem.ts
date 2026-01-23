import type { User } from "./User";

export type Weight = "Low" | "Medium" | "High";
export interface WantedItem {
  id?: number,
  artist: string,
  album: string,
  imageUrl?: string,
  searcher: User[],
  notes?: string,
  created_at?: Date,
  weight: Weight
}

export interface WantedItemDbPayload extends Omit<Partial<WantedItem>, 'searcher'> {
  searcher?: string[];
}