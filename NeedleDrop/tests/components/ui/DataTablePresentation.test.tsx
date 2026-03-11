import { type UserContextType, useUserContext } from "@context/users/UserContext";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import * as ReactRouterDom from "react-router-dom";

import DataTablePresentation from "@components/ui/DataTablePresentation";
import { MemoryRouter } from "react-router-dom";
import type { UserSettings } from "@interfaces/UserSettings";

// 1. Mock the context hook with the correct return type
vi.mock("@context/users/UserContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@context/users/UserContext")>();
  return {
    ...actual,
    useUserContext: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof ReactRouterDom>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockedUseUserContext = useUserContext as unknown as ReturnType<typeof vi.fn>;

describe("DataTablePresentation", () => {
  const mockUpdateSettings = vi.fn();
  const mockGetSettings = vi.fn(() => ({} as UserSettings));

  const createMockContext = (overrides: Partial<UserContextType>): UserContextType => ({
    users: [],
    isLoading: false,
    isFetching: false,
    error: null,
    getCurrentUserSettings: mockGetSettings,
    updateCurrentUserSettings: mockUpdateSettings,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseUserContext.mockReturnValue(createMockContext({}));
  });

  afterEach(cleanup);

  it("renders the loading state when context is loading", () => {
    mockedUseUserContext.mockReturnValue(createMockContext({ isLoading: true }));

    render(
      <MemoryRouter>
        <DataTablePresentation 
          items={[]} 
          columns={[{ field: "id", headerName: "ID" }]} 
          slug="test" 
          settingsColumn="vinyls" 
        />
      </MemoryRouter>
    );
    
    expect(screen.getByRole("progressbar")).toBeDefined();
  });

it("renders rows correctly", () => {
  render(
    <MemoryRouter>
      <DataTablePresentation 
        items={[{ id: 1, title: "Vinyl 1" }]} 
        columns={[
          { field: "id", headerName: "ID" },
          { field: "title", headerName: "Title" }
        ]} 
        slug="vinyls" 
        settingsColumn="vinyls" 
      />
    </MemoryRouter>
  );

  expect(screen.getByText("Vinyl 1")).toBeDefined();
});

  it("navigates to the detail page on row click", async () => {
    render(
      <MemoryRouter>
        <DataTablePresentation 
          items={[{ id: 1, title: "Vinyl 1" }]} 
          columns={[{ field: "id", headerName: "ID" }]} 
          slug="vinyls" 
          settingsColumn="vinyls" 
        />
      </MemoryRouter>
    );

    const rows = screen.getAllByRole("row");
    const firstDataRow = rows[1]; 

    fireEvent.click(firstDataRow);

    expect(mockNavigate).toHaveBeenCalledWith("/vinyls/1");
  });
});