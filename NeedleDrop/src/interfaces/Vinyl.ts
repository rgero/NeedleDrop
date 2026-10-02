import type { Location } from "./Location";
import type { PlayLog } from "./PlayLog";
import type { User } from "./User";

export interface Vinyl {
  id?: number;
  purchaseNumber?: number;
  artist: string;
  album: string;
  color?: string;
  purchaseDate: Date | null;
  purchaseLocation: Location|null;
  price?: number;
  owners: User[];
  purchasedBy: User[];
  length: number;
  notes?: string;
  playCount?: number;
  likedBy: User[];
  imageUrl?: string;
  doubleLP: boolean;
  tags: string[];
  archived?: boolean;
  playlogs?: PlayLog[];
}

export interface VinylDbPayload extends Partial<Pick<Vinyl, 'artist' | 'album' | 'color' | 'price' | 'length' | 'notes' | 'tags' | 'archived'>> {
  owners?: string[] | null;
  liked_by?: string[] | null;
  purchased_by?: string[] | null;
  purchase_location?: number | null;
  purchase_date?: string | null;
  double_lp?: boolean;
  image_url?: string;
}

export interface VinylDbRow extends VinylDbPayload {
  id?: number;
  artist: string;
  album: string;
  length: number;
  tags: string[];
  double_lp: boolean;
  purchase_number?: number;
  play_count?: number;
  playlogs?: { count: number }[];
}