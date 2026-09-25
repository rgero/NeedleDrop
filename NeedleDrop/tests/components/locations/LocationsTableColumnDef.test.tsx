import { describe, expect, it } from "vitest";

import { LocationTableColumnDef } from "@components/locations/LocationsTableColumnDef";

const renderCell = (cell: unknown, value: unknown) => {
  if (typeof cell !== "function") {
    throw new Error("Expected a cell renderer function");
  }

  return (cell as (context: { getValue: () => unknown }) => unknown)({
    getValue: () => value,
  });
};

describe("LocationTableColumnDef", () => {
  it("formats recommended and percentage values", () => {
    const recommendedColumn = LocationTableColumnDef[2];
    const percentageColumn = LocationTableColumnDef[4];

    expect(renderCell(recommendedColumn.cell, true)).toBe("Yes");
    expect(renderCell(recommendedColumn.cell, false)).toBe("No");
    expect(renderCell(recommendedColumn.cell, null)).toBe("");
    expect(renderCell(percentageColumn.cell, 12.345)).toBe("12.35%");
    expect(renderCell(percentageColumn.cell, undefined)).toBe("");
  });

  it("marks notes as checked only when non-empty text exists", () => {
    const notesColumn = LocationTableColumnDef[5];
    const checked = renderCell(notesColumn.cell, "Keep near the counter");
    const unchecked = renderCell(notesColumn.cell, "  ");

    expect(checked).toHaveProperty("props.checked", true);
    expect(unchecked).toHaveProperty("props.checked", false);
  });
});