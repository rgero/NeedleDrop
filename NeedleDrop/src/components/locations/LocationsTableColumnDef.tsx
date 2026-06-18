import type { Location } from "@interfaces/Location";
import { createColumnHelper } from "@tanstack/react-table";

const columnHelper = createColumnHelper<Location>();

export const LocationTableColumnDef = [
  columnHelper.accessor("name", {
    header: "Name",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("address", {
    header: "Address",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("recommended", {
    header: "Recommended",
    cell: (info) => {
      const value = info.getValue();
      if (value === true) return "Yes";
      if (value === false) return "No";
      return "";
    },
  }),
  columnHelper.accessor("purchaseCount", {
    header: "Purchase Count",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("percentage", {
    header: "Percentage",
    cell: (info) => {
      const value = info.getValue();
      if (value === null || value === undefined) return "";
      return `${value.toFixed(2)}%`;
    },
  }),
  columnHelper.accessor("notes", {
    header: "Notes",
    cell: (info) => info.getValue(),
  }),
];