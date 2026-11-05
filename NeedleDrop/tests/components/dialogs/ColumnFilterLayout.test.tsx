import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import type { DropResult } from "@hello-pangea/dnd";
import type { ColumnDef } from "@tanstack/react-table";
import ColumnFilterDialog from "@components/dialogs/ColumnFilterDialog";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import type { UserSettings } from "@interfaces/settings/UserSettings";
import type { TableSettingsKey } from "@context/dialog/tableDialogTypes";
import { normalizeColumnOrder } from "@utils/normalizeColumnOrder";

let settings: UserSettings;
let table: TableSettingsKey;
let open = true;
let onDragEnd: (result: DropResult) => void;
const updateSettings = vi.fn((updates: Partial<UserSettings>) => {
  settings = { ...settings, ...updates };
});
const setSearchParams = vi.fn();
const columns: ColumnDef<unknown>[] = [
  { id: "artist", header: "Artist", accessorFn: () => "" },
  { id: "date", header: "Date", accessorFn: () => "", meta: { filterVariant: "date" } },
];
let searchParams = new URLSearchParams();

vi.mock("@context/users/UserContext", () => ({
  useUserContext: () => ({
    getCurrentUserSettings: () => settings,
    updateCurrentUserSettings: updateSettings,
  }),
}));
vi.mock("@context/dialog/DialogContext", () => ({
  useDialogProvider: () => ({
    columnFilterDialogOpen: open,
    columnFilterDialogConfig: { columns, settingsColumn: table },
    closeColumnFilterDialog: vi.fn(),
  }),
}));
vi.mock("react-router-dom", async (importOriginal) => ({
  ...await importOriginal<typeof import("react-router-dom")>(),
  useSearchParams: () => [searchParams, setSearchParams],
}));
vi.mock("@hello-pangea/dnd", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@hello-pangea/dnd")>();
  return {
    ...actual,
    DragDropContext: (props: React.ComponentProps<typeof actual.DragDropContext>) => {
      onDragEnd = (result) => props.onDragEnd(result, { announce: vi.fn() });
      return <actual.DragDropContext {...props} />;
    },
  };
});

const resetLayout = (label: string) => {
  fireEvent.click(screen.getByRole("button", { name: "Filter layout options" }));
  fireEvent.click(screen.getByRole("menuitem", { name: label }));
};
const drop = (destination: number | null) => onDragEnd({
  draggableId: "artist",
  type: "DEFAULT",
  source: { droppableId: "table-filter-order", index: 0 },
  destination: destination === null ? null : { droppableId: "table-filter-order", index: destination },
  reason: destination === null ? "CANCEL" : "DROP",
  mode: "FLUID",
  combine: null,
});
const handles = () => screen.getAllByRole("button", { name: /^Reorder/ }).map((node) => node.getAttribute("aria-label"));

describe("saved filter layouts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    settings = structuredClone(DefaultSettings);
    table = "vinyls";
    open = true;
    searchParams = new URLSearchParams();
  });

  it("normalizes duplicate/stale IDs and appends new filters", () => {
    expect(normalizeColumnOrder(["date", "date", "removed"], ["artist", "date", "new"])).toEqual(["date", "artist", "new"]);
  });

  it("uses expanded definition order for legacy settings", () => {
    Reflect.deleteProperty(settings, "tableFilterLayouts");
    render(<ColumnFilterDialog />);
    expect(handles()).toEqual(["Reorder Artist", "Reorder Date"]);
    expect(screen.getByRole("button", { name: "Collapse Artist" })).toHaveAttribute("aria-expanded", "true");
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it("restores saved layout on reopen and isolates tables", () => {
    settings.tableFilterLayouts.vinyls = { order: ["date", "artist"], collapsed: ["date"] };
    const { rerender } = render(<ColumnFilterDialog />);
    expect(handles()).toEqual(["Reorder Date", "Reorder Artist"]);
    expect(screen.getByRole("button", { name: "Expand Date" })).toBeVisible();
    open = false;
    rerender(<ColumnFilterDialog />);
    open = true;
    rerender(<ColumnFilterDialog />);
    expect(screen.getByRole("button", { name: "Expand Date" })).toBeVisible();
    table = "locations";
    rerender(<ColumnFilterDialog />);
    expect(handles()).toEqual(["Reorder Artist", "Reorder Date"]);
    expect(screen.getByRole("button", { name: "Collapse Date" })).toBeVisible();
  });

  it("persists reorder and collapse while preserving drafts and other settings", () => {
    const { rerender } = render(<ColumnFilterDialog />);
    fireEvent.change(screen.getByRole("textbox", { name: "Value" }), { target: { value: "Miles" } });
    drop(1);
    rerender(<ColumnFilterDialog />);
    expect(handles()).toEqual(["Reorder Date", "Reorder Artist"]);
    fireEvent.click(screen.getByRole("button", { name: "Collapse Artist" }));
    rerender(<ColumnFilterDialog />);
    expect(settings.tableFilterLayouts.vinyls).toEqual({ order: ["date", "artist"], collapsed: ["artist"] });
    expect(settings.tableFilterLayouts.locations).toEqual(DefaultSettings.tableFilterLayouts.locations);
    expect(settings.vinyls).toEqual(DefaultSettings.vinyls);
    expect(screen.getByText("Active")).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "Expand Artist" }));
    rerender(<ColumnFilterDialog />);
    expect(screen.getByRole("textbox", { name: "Value" })).toHaveValue("Miles");
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it("ignores canceled and unchanged drops", () => {
    render(<ColumnFilterDialog />);
    drop(null);
    drop(0);
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it.each(["keyboard", "pointer"])("supports %s dragging from the handle without toggling collapse", async (input) => {
    render(<ColumnFilterDialog />);
    const handle = screen.getByRole("button", { name: "Reorder Artist" });
    handle.focus();
    if (input === "keyboard") {
      fireEvent.keyDown(handle, { key: " ", code: "Space", keyCode: 32 });
    } else {
      fireEvent.mouseDown(handle, { button: 0, clientX: 10, clientY: 10 });
      fireEvent.mouseMove(window, { buttons: 1, clientX: 30, clientY: 30 });
    }
    await waitFor(() => expect(screen.getByText(/You have lifted an item in position 1/)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Collapse Artist" })).toHaveAttribute("aria-expanded", "true");
    fireEvent.keyDown(handle, { key: "Escape", code: "Escape", keyCode: 27 });
    const card = handle.closest("[data-rfd-draggable-id]");
    if (!card) throw new Error("Missing draggable filter card");
    const transitionEnd = new Event("transitionend", { bubbles: true });
    Object.defineProperty(transitionEnd, "propertyName", { value: "transform" });
    fireEvent(card, transitionEnd);
    await waitFor(() => expect(screen.getByText(/Movement cancelled/)).toBeInTheDocument());
    expect(updateSettings).not.toHaveBeenCalled();
  });

  it("resets order and visibility independently without changing values or columns", async () => {
    settings.tableFilterLayouts.vinyls = { order: ["date", "artist"], collapsed: ["date"] };
    const { rerender } = render(<ColumnFilterDialog />);
    fireEvent.change(screen.getByRole("textbox", { name: "Value" }), { target: { value: "Miles" } });
    resetLayout("Reset order");
    rerender(<ColumnFilterDialog />);
    expect(settings.tableFilterLayouts.vinyls).toEqual({ order: ["artist", "date"], collapsed: ["date"] });
    expect(handles()).toEqual(["Reorder Artist", "Reorder Date"]);
    await waitFor(() => expect(screen.queryByRole("menuitem")).not.toBeInTheDocument());
    resetLayout("Reset visibility");
    rerender(<ColumnFilterDialog />);
    expect(settings.tableFilterLayouts.vinyls).toEqual({ order: ["artist", "date"], collapsed: [] });
    expect(screen.getByRole("button", { name: "Collapse Date" })).toBeVisible();
    expect(screen.getByRole("textbox", { name: "Value" })).toHaveValue("Miles");
    expect(settings.vinyls).toEqual(DefaultSettings.vinyls);
    expect(setSearchParams).not.toHaveBeenCalled();
  });

  it("keeps collapsed invalid dates visible in headers and blocks Apply", () => {
    searchParams = new URLSearchParams("f_date_value_month=2&f_date_value_day=30");
    settings.tableFilterLayouts.vinyls.collapsed = ["date"];
    render(<ColumnFilterDialog />);
    expect(screen.getByText("Invalid date")).toBeVisible();
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  it("bottom Reset clears only URL filters", () => {
    searchParams = new URLSearchParams("page=2&f_artist=Miles");
    settings.tableFilterLayouts.vinyls = { order: ["date", "artist"], collapsed: ["artist"] };
    render(<ColumnFilterDialog />);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(setSearchParams.mock.calls[0][0].toString()).toBe("page=2");
    expect(updateSettings).not.toHaveBeenCalled();
    expect(settings.tableFilterLayouts.vinyls.collapsed).toEqual(["artist"]);
  });
});
