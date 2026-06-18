import { type Vinyl } from "@interfaces/Vinyl";
import { createColumnHelper } from "@tanstack/react-table";
import { stripArticles } from "@utils/StripArticles";

const columnHelper = createColumnHelper<Vinyl>();

const vinylColumns = [
  columnHelper.accessor("purchaseNumber", {
    header: "#",
    cell: info => info.getValue(),
    meta: {
      filterVariant: "number",
    },
  }),
  columnHelper.accessor("artist", {
    header: "Artist",
    cell: info => info.getValue(),
    sortingFn: (v1, v2) => stripArticles(v1.original.artist).localeCompare(stripArticles(v2.original.artist)),
  }),
  columnHelper.accessor("album", {
    header: "Album",
    cell: info => info.getValue(),
    sortingFn: (v1, v2) => stripArticles(v1.original.album).localeCompare(stripArticles(v2.original.album)),
  }),
  columnHelper.accessor("purchaseDate", {
    header: "Purchase Date",
    cell: info => info.getValue().toISOString().split("T")[0],
    meta: {
      filterVariant: "date",
    },
  }),
  columnHelper.accessor("purchaseLocation", {
    header: "Purchase Location",
    cell: info => info.getValue()?.name ?? '',
  }),
  columnHelper.accessor("owners", {
    header: "Owners",
    cell: info => info.getValue()?.map(u => u.name).join(', ') ?? '',
  }),
  columnHelper.accessor("purchasedBy", {
    header: "Purchased By",
    cell: info => info.getValue()?.map(u => u.name).join(', ') ?? '',
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: info => info.getValue(),
    meta: {
      filterVariant: "number",
    },
  }),
  columnHelper.accessor("length", {
    header: "Length (min)",
    cell: info => info.getValue(),
    meta: {
      filterVariant: "number",
    },
  }),
  columnHelper.accessor("playCount", {
    header: "Play Count",
    cell: info => info.getValue(),
    meta: {
      filterVariant: "number",
    },
  }),
  columnHelper.accessor("likedBy", {
    header: "Liked By",
    cell: info => info.getValue()?.map(u => u.name).join(', ') ?? '',
  }),
  columnHelper.accessor("notes", {
    header: "Notes",
    cell: info => info.getValue(),
  }),
  columnHelper.accessor("color", {
    header: "Color",
    cell: info => info.getValue(),
  }), 
  columnHelper.accessor("doubleLP", {
    header: "Double LP",
    cell: info => info.getValue() ? "Yes" : "No",
    meta: {
      filterVariant: "boolean",
    },
  }),
  columnHelper.accessor("tags", {
    header: "Tags",
    cell: info => info.getValue()?.join(', ') ?? '',
  })
];

export default vinylColumns;