import { Checkbox } from "@mui/material";
import type { PlayLog } from "@interfaces/PlayLog";
import type { User } from '@interfaces/User';
import { createColumnHelper } from "@tanstack/react-table";
import { stripArticles } from '@utils/StripArticles';
import { formatInstantDate } from "@utils/DateTime";

const columnHelper = createColumnHelper<PlayLog>();

export const createPlayLogTableColumnDef = (timeZone?: string) => [
  columnHelper.accessor("playNumber", {
    header: "#",
    size: 60,
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("date", {
    header: "Date",
    sortingFn: "datetime",
    cell: info => {
      const value = info.getValue();
      if (!value) return '';

      const dateObj = typeof value === 'string' ? new Date(value) : value;
      if (isNaN(dateObj.getTime())) return ''; 
      
      return formatInstantDate(dateObj, timeZone);
    },
    meta: {
      filterVariant: "date",
    },
  }),
  columnHelper.accessor("artist", {
    header: "Artist",
    size: 250,
    // Custom sort logic using stripArticles
    sortingFn: (rowA, rowB, columnId) => {
      const a = stripArticles(rowA.getValue(columnId));
      const b = stripArticles(rowB.getValue(columnId));
      return a.localeCompare(b);
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("album", {
    header: "Album",
    size: 250,
    sortingFn: (rowA, rowB, columnId) => {
      const a = stripArticles(rowA.getValue(columnId));
      const b = stripArticles(rowB.getValue(columnId));
      return a.localeCompare(b);
    },
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("listeners", {
    header: "Listeners",
    cell: (info) => {
      const value = info.getValue();
      return value?.map((u: User) => u.name).join(', ') ?? '';
    },
  }),
  columnHelper.accessor("notes", {
    header: "Notes",
    cell: ({ getValue }) => {
      const value = getValue();
      const hasNotes = typeof value === 'string' && value.trim() !== '';      
      return (
        <Checkbox
          checked={hasNotes}
          disabled
        />
      );
    },
    meta: {
      filterVariant: "boolean",
    }
  }),
];

export const PlayLogTableColumnDef = createPlayLogTableColumnDef();