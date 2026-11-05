import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ColumnDef } from "@tanstack/react-table";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";

const openColumnFilterDialog = vi.fn();
let searchParams = new URLSearchParams();

vi.mock("@context/dialog/DialogContext", () => ({
  useDialogProvider: () => ({ openColumnFilterDialog }),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...await importOriginal<typeof import("react-router-dom")>(),
  useSearchParams: () => [searchParams, vi.fn()],
}));

const columns: ColumnDef<{ artist: string; owned: boolean; date: string }>[] = [
  { accessorKey: "artist", header: "Artist" },
  { accessorKey: "owned", header: "Owned", meta: { filterVariant: "boolean" } },
  { accessorKey: "date", header: "Date", meta: { filterVariant: "date" } },
];

describe("ColumnFilterButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParams = new URLSearchParams();
  });

  it.each([
    "",
    "page=2",
    "f_unknown=value",
    "f_artist=%20%20",
    "f_date_op=between&f_date_from=2026-01-01",
    "f_date_value_month=13",
    "f_date_op=between&f_date_from_year=2024&f_date_to_month=3",
  ])("uses the default color without an active filter: %s", (query) => {
    searchParams = new URLSearchParams(query);
    render(<ColumnFilterButton columns={columns} settingsColumn="vinyls" />);

    expect(screen.getByRole("button", { name: "Configure table filters" })).not.toHaveClass("MuiIconButton-colorPrimary");
  });

  it.each([
    ["f_artist=Miles", "1 active filter"],
    ["f_owned=false", "1 active filter"],
    ["f_artist=Miles&f_owned=true", "2 active filters"],
    ["f_date_value_year=2024", "1 active filter"],
    ["f_date_value_month=3&f_date_value_day=15", "1 active filter"],
    ["f_date_op=between&f_date_from_month=11&f_date_to_month=2", "1 active filter"],
  ])("highlights active filters and announces their count: %s", (query, status) => {
    searchParams = new URLSearchParams(query);
    render(<ColumnFilterButton columns={columns} settingsColumn="vinyls" />);

    expect(screen.getByRole("button", { name: `Configure table filters (${status})` })).toHaveClass("MuiIconButton-colorPrimary");
  });

  it("updates the highlight when filters are applied and cleared", () => {
    const { rerender } = render(<ColumnFilterButton columns={columns} settingsColumn="vinyls" />);

    searchParams = new URLSearchParams("f_artist=Miles");
    rerender(<ColumnFilterButton columns={columns} settingsColumn="vinyls" />);
    expect(screen.getByRole("button")).toHaveClass("MuiIconButton-colorPrimary");

    searchParams = new URLSearchParams();
    rerender(<ColumnFilterButton columns={columns} settingsColumn="vinyls" />);
    expect(screen.getByRole("button")).not.toHaveClass("MuiIconButton-colorPrimary");
  });

  it("opens the filter dialog with the table columns", () => {
    render(<ColumnFilterButton columns={columns} settingsColumn="vinyls" />);
    fireEvent.click(screen.getByRole("button"));

    expect(openColumnFilterDialog).toHaveBeenCalledWith({ columns, settingsColumn: "vinyls" });
  });
});