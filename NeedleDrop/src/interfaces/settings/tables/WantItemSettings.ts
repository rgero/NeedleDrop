import type { GridColumnVisibilityModel } from "@mui/x-data-grid"

export interface WantItemSettings extends GridColumnVisibilityModel {
  artist: boolean,
  album: boolean,
  imageUrl: boolean,
  searcher: boolean,
  created_at: boolean,
  weight: boolean,
  notes: boolean,
}
