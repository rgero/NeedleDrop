import type { User } from "./User";

export interface Vinyl {
  id?: string;
  purchaseNumber: number;
  artist: string;
  album: string;
  purchaseDate: Date;
  purchaseLocation: string;
  price: number;
  owner: User[];
  length: number;
  notes?: string;
  playCount: number;
  likedBy: User[];
}
