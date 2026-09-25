import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import LocationsTable from "@components/locations/LocationsTable";

const { mockLocations, mockUseLocationContext } = vi.hoisted(() => ({
  mockLocations: [
    { id: 1, name: "Record shop", address: "1 Main St", recommended: true, notes: "" },
  ],
  mockUseLocationContext: vi.fn(),
}));

vi.mock("@context/location/LocationContext", () => ({
  useLocationContext: mockUseLocationContext,
}));

vi.mock("@components/ui/tables/ReactTable", () => ({
  default: ({ data, columns, settingsColumn }: { data: unknown[]; columns: unknown[]; settingsColumn: string }) => (
    <div data-testid="react-table">{`${data.length}:${columns.length}:${settingsColumn}`}</div>
  ),
}));

describe("LocationsTable", () => {
  beforeEach(() => {
    mockUseLocationContext.mockReturnValue({ locations: mockLocations });
  });

  it("passes locations and the location column definition to ReactTable", () => {
    render(<LocationsTable />);

    expect(screen.getByTestId("react-table")).toHaveTextContent("1:6:locations");
  });
});