import type { User } from "./User";

export type Weight = "Low" | "Medium" | "High";
export interface WantedItem {
  id?: number,
  artist: string,
  album: string,
  imageUrl?: string,
  searcher: User[],
  notes?: string,
  length: number | null,
  created_at: Date,
  weight: Weight
}

export interface WantedItemDbPayload extends Partial<Pick<WantedItem, 'artist' | 'album' | 'notes' | 'length' | 'weight'>> {
  searcher?: string[];
  image_url?: string;
  created_at?: string;
}

export interface WantedItemDbRow extends Omit<WantedItem, 'searcher' | 'imageUrl' | 'created_at'> {
  searcher: string[] | null;
  image_url?: string;
  created_at: string;
}