import type { GridColumnVisibilityModel } from "@mui/x-data-grid"

export interface VinylSettings extends GridColumnVisibilityModel {
  purchaseNumber: boolean,
  artist: boolean,
  album: boolean,
  color: boolean,
  purchaseDate: boolean,
  purchaseLocation: boolean,
  owners: boolean,
  purchasedBy: boolean,
  likedBy: boolean,
  notes: boolean,
  doubleLP: boolean,
  isComplete: boolean,
  length: boolean,
  playCount: boolean,
  price: boolean,
  tags: boolean,
}