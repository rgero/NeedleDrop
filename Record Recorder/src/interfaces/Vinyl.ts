import type { Location } from "./Location";
import type { User } from "./User";

export interface Vinyl {
  id?: number;
  purchaseNumber?: number;
  artist: string;
  album: string;
  color?: string;
  purchaseDate: Date;
  purchaseLocation: Location|null;
  price?: number;
  owners: User[];
  length: number;
  notes?: string;
  playCount?: number;
  likedBy: User[];
  imageUrl?: string;
}

export interface VinylDbPayload extends Omit<Partial<Vinyl>, 'owners' | 'likedBy' | 'purchaseLocation' | 'purchaseDate'> {
  owners?: string[] | null;
  likedBy?: string[] | null;
  purchaseLocation?: number | null;
  purchaseDate?: string | null;
}