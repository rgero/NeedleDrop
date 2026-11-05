import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import ColumnFilterDialog from "@components/dialogs/ColumnFilterDialog";

const closeColumnFilterDialog = vi.fn();
const setSearchParams = vi.fn();
const columns = [{ accessorKey: "date", header: "Release Date", meta: { filterVariant: "date" } }];
let searchParams = new URLSearchParams();
let dialogOpen = true;

vi.mock("@context/dialog/DialogContext", () => ({
  useDialogProvider: () => ({
    columnFilterDialogOpen: dialogOpen,
    columnFilterDialogConfig: { columns },
    closeColumnFilterDialog,
  }),
}));

vi.mock("react-router-dom", async (importOriginal) => ({
  ...await importOriginal<typeof import("react-router-dom")>(),
  useSearchParams: () => [searchParams, setSearchParams],
}));

const choose = (label: string, option: string) => {
  fireEvent.mouseDown(screen.getByRole("combobox", { name: label }));
  fireEvent.click(screen.getByRole("option", { name: option }));
};

const apply = () => {
  fireEvent.click(screen.getByRole("button", { name: "Apply" }));
  return setSearchParams.mock.calls.at(-1)?.[0] as URLSearchParams;
};

describe("ColumnFilterDialog partial dates", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    searchParams = new URLSearchParams();
    dialogOpen = true;
  });

  it.each(["Equals", "Between"])("hides numeric spinners in %s date fields while retaining numeric input", (condition) => {
    render(<ColumnFilterDialog />);
    if (condition === "Between") {
      choose("Condition", "Between");
    }
    const inputs = screen.getAllByRole("spinbutton");
    expect(inputs).toHaveLength(condition === "Between" ? 4 : 2);
    for (const input of inputs) {
      expect(input).toHaveStyle({ appearance: "textfield" });
      expect(input).toHaveAttribute("inputmode", "numeric");
    }
  });

  it("applies month and day without supplying a year", () => {
    searchParams = new URLSearchParams("page=2");
    render(<ColumnFilterDialog />);
    choose("Month", "March");
    fireEvent.change(screen.getByRole("spinbutton", { name: "Day" }), { target: { value: "15" } });
    const output = apply();
    expect(output.get("f_date_value_month")).toBe("3");
    expect(output.get("f_date_value_day")).toBe("15");
    expect(output.has("f_date_value_year")).toBe(false);
    expect(output.get("page")).toBe("2");
    expect(closeColumnFilterDialog).toHaveBeenCalledOnce();
  });

  it("applies year-only and allows clearing individual fields", () => {
    render(<ColumnFilterDialog />);
    choose("Month", "March");
    choose("Month", "Any");
    fireEvent.change(screen.getByRole("spinbutton", { name: "Year" }), { target: { value: "2024" } });
    expect(apply().get("f_date_value_year")).toBe("2024");
    expect(setSearchParams.mock.calls[0][0].has("f_date_value_month")).toBe(false);
  });

  it("restores full-date and partial filters when reopened", () => {
    searchParams = new URLSearchParams("f_date_value=2024-03-15");
    const { rerender } = render(<ColumnFilterDialog />);
    expect(screen.getByRole("spinbutton", { name: "Year" })).toHaveValue(2024);
    expect(screen.getByRole("combobox", { name: "Month" })).toHaveTextContent("March");
    expect(screen.getByRole("spinbutton", { name: "Day" })).toHaveValue(15);
    dialogOpen = false;
    rerender(<ColumnFilterDialog />);
    searchParams = new URLSearchParams("f_date_value_year=2025");
    dialogOpen = true;
    rerender(<ColumnFilterDialog />);
    expect(screen.getByRole("spinbutton", { name: "Year" })).toHaveValue(2025);
    expect(screen.getByRole("spinbutton", { name: "Day" })).toHaveValue(null);
  });

  it("blocks impossible dates but permits a recurring leap day", () => {
    render(<ColumnFilterDialog />);
    choose("Month", "February");
    fireEvent.change(screen.getByRole("spinbutton", { name: "Day" }), { target: { value: "30" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Day is not valid");
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    fireEvent.change(screen.getByRole("spinbutton", { name: "Day" }), { target: { value: "29" } });
    expect(screen.getByRole("button", { name: "Apply" })).toBeEnabled();
    fireEvent.change(screen.getByRole("spinbutton", { name: "Year" }), { target: { value: "2023" } });
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
  });

  it("validates matching range parts and supports yearless wraparound", () => {
    render(<ColumnFilterDialog />);
    choose("Condition", "Between");
    choose("From Month", "November");
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    expect(screen.getByRole("alert")).toHaveTextContent("same date parts");
    choose("To Month", "February");
    expect(screen.getByRole("button", { name: "Apply" })).toBeEnabled();
    fireEvent.change(screen.getByRole("spinbutton", { name: "From Year" }), { target: { value: "2024" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: "To Year" }), { target: { value: "2024" } });
    expect(screen.getByRole("alert")).toHaveTextContent("From must not be after To");
    fireEvent.change(screen.getByRole("spinbutton", { name: "From Year" }), { target: { value: "" } });
    fireEvent.change(screen.getByRole("spinbutton", { name: "To Year" }), { target: { value: "" } });
    const output = apply();
    expect(output.get("f_date_from_month")).toBe("11");
    expect(output.get("f_date_to_month")).toBe("2");
  });

  it("separates range boundaries into labeled groups without repeating visible field prefixes", () => {
    render(<ColumnFilterDialog />);
    choose("Condition", "Between");
    const from = screen.getByRole("group", { name: "Release Date from" });
    const to = screen.getByRole("group", { name: "Release Date to" });
    expect(within(from).getByText("From")).toBeVisible();
    expect(within(to).getByText("To")).toBeVisible();
    expect(within(from).getByRole("spinbutton", { name: "From Year" })).toBeVisible();
    expect(within(to).getByRole("combobox", { name: "To Month" })).toBeVisible();
    expect(within(from).queryByText("From Year")).not.toBeInTheDocument();
    expect(within(to).queryByText("To Month")).not.toBeInTheDocument();
    expect(screen.getByRole("separator")).toBeVisible();
  });

  it("retains single-date drafts across conditions and ignores hidden invalid ranges", () => {
    render(<ColumnFilterDialog />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Year" }), { target: { value: "2024" } });
    choose("Condition", "Between");
    choose("From Month", "November");
    expect(screen.getByRole("button", { name: "Apply" })).toBeDisabled();
    choose("Condition", "After");
    expect(screen.getByRole("spinbutton", { name: "Year" })).toHaveValue(2024);
    expect(screen.getByRole("button", { name: "Apply" })).toBeEnabled();
    const output = apply();
    expect(output.get("f_date_op")).toBe("after");
    expect(output.has("f_date_from_month")).toBe(false);
  });

  it("resets fields and URL filters without closing the dialog", () => {
    searchParams = new URLSearchParams("page=2&f_date_value_year=2024");
    render(<ColumnFilterDialog />);
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(setSearchParams.mock.calls[0][0].toString()).toBe("page=2");
    expect(closeColumnFilterDialog).not.toHaveBeenCalled();
  });

  it("dismisses without applying draft edits", () => {
    render(<ColumnFilterDialog />);
    fireEvent.change(screen.getByRole("spinbutton", { name: "Year" }), { target: { value: "2024" } });
    fireEvent.keyDown(within(screen.getByRole("dialog")).getByRole("spinbutton", { name: "Year" }), { key: "Escape" });
    expect(closeColumnFilterDialog).toHaveBeenCalledOnce();
    expect(setSearchParams).not.toHaveBeenCalled();
  });
});