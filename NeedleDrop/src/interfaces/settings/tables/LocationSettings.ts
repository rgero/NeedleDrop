import type { GridColumnVisibilityModel } from "@mui/x-data-grid";

export interface LocationSettings extends GridColumnVisibilityModel {
  name: boolean,
  address: boolean,
  recommended: boolean,
  purchaseCount: boolean,
  notes: boolean,
}
