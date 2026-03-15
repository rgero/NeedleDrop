import type { GridColumnVisibilityModel } from "@mui/x-data-grid"

export interface PlaylogsSettings extends GridColumnVisibilityModel  {
  date: boolean,
  listeners: boolean,
  artist: boolean,
  album: boolean
}