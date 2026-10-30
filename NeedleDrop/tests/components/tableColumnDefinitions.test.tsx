import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { LocationTableColumnDef } from "@components/locations/LocationsTableColumnDef";
import { PlayLogTableColumnDef } from "@components/playlog/PlayLogTableColumnDef";
import { WantedItemTableColumnDef } from "@components/wanted/WantedTableColumnDef";
import vinylColumns from "@components/vinyls/VinylsTableColumns";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";

type NotesColumn = {
  accessorKey?: string;
  id?: string;
  meta?: { filterVariant?: string };
  cell?: (context: { getValue: () => string | undefined }) => React.ReactNode;
};

const getNotesColumn = (columns: readonly NotesColumn[]) => {
  const notesColumn = columns.find((column) => (column.accessorKey ?? column.id) === "notes");

  if (!notesColumn) {
    throw new Error("Notes column was not defined");
  }

  return notesColumn;
};

const getReleaseDateColumn = () => {
  const column = vinylColumns.find((column) => column.accessorKey === "releaseDate");
  if (!column || typeof column.cell !== "function") {
    throw new Error("Release date column was not defined");
  }

  return {
    ...column,
    cell: column.cell as (context: { getValue: () => Date | string | null | undefined }) => React.ReactNode,
  };
};

describe("vinyl release date column", () => {
  it("supports date filtering and sorting and is hidden by default", () => {
    const column = getReleaseDateColumn();

    expect(column.header).toBe("Release Date");
    expect(column.sortingFn).toBe("datetime");
    expect(column.meta?.filterVariant).toBe("date");
    expect(DefaultSettings.vinyls.releaseDate).toBe(false);
  });

  it.each([
    new Date("2011-03-15T12:00:00Z"),
    "2011-03-15",
    "2011-03-15T12:00:00Z",
  ])("formats a valid release date (%s) as yyyy-MM-dd", (value) => {
    expect(getReleaseDateColumn().cell({ getValue: () => value })).toBe("2011-03-15");
  });

  it.each([null, undefined, "", "invalid date", new Date(NaN)])(
    "renders an absent or invalid release date (%s) as blank",
    (value) => {
      expect(getReleaseDateColumn().cell({ getValue: () => value })).toBe("");
    },
  );
});

describe("notes table columns", () => {
  it.each([
    ["locations", LocationTableColumnDef],
    ["playlogs", PlayLogTableColumnDef],
    ["vinyls", vinylColumns],
    ["wanted items", WantedItemTableColumnDef],
  ] as const)("marks non-empty %s notes as present", (_table, columns) => {
    const notesColumn = getNotesColumn(columns);

    expect(notesColumn.meta?.filterVariant).toBe("boolean");

    render(notesColumn.cell?.({ getValue: () => "Keep this record" }));

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it.each([
    ["locations", LocationTableColumnDef],
    ["playlogs", PlayLogTableColumnDef],
    ["vinyls", vinylColumns],
    ["wanted items", WantedItemTableColumnDef],
  ] as const)("marks missing or whitespace-only %s notes as absent", (_table, columns) => {
    const notesColumn = getNotesColumn(columns);

    const { rerender } = render(notesColumn.cell?.({ getValue: () => "   " }));
    expect(screen.getByRole("checkbox")).not.toBeChecked();

    rerender(notesColumn.cell?.({ getValue: () => undefined }));
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });
});