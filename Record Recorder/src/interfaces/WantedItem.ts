import type { User } from "./User";

export interface WantedItem {
  artist: string,
  album: string,
  imageUrl?: string,
  searcher: User[],
  notes?: string
}