import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { createColumnHelper } from "@tanstack/react-table";

import ReactTable from "@components/ui/tables/ReactTable";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import { useUserContext, type UserContextType } from "@context/users/UserContext";

vi.mock("@context/users/UserContext", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@context/users/UserContext")>();
  return {
    ...actual,
    useUserContext: vi.fn(),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

type TestRow = {
  id: number;
  artist: string;
};

type TableKey = "locations" | "playlogs" | "vinyls" | "wantedItems";

const columnHelper = createColumnHelper<TestRow>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    cell: (info) => info.getValue(),
  }),
  columnHelper.accessor("artist", {
    header: "Artist",
    cell: (info) => info.getValue(),
  }),
];

const mockedUseUserContext = useUserContext as unknown as ReturnType<typeof vi.fn>;

describe("ReactTable", () => {
  const mockUpdateCurrentUserSettings = vi.fn();

  const createContext = (overrides: Partial<UserContextType> = {}): UserContextType => ({
    users: [],
    isLoading: false,
    isFetching: false,
    error: null,
    getCurrentUserSettings: () => DefaultSettings,
    updateCurrentUserSettings: mockUpdateCurrentUserSettings,
    ...overrides,
  });

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseUserContext.mockReturnValue(createContext());
  });

  const buildSettingsWithEmptySortFor = (settingsColumn: TableKey) => ({
    ...DefaultSettings,
    sortModels: {
      ...DefaultSettings.sortModels,
      [settingsColumn]: [],
    },
  });

  it.each([
    ["playlogs", "/plays"],
    ["locations", "/locations"],
    ["vinyls", "/vinyls"],
    ["wantedItems", "/wantlist"],
  ] as const)("navigates to details on row click for %s", (settingsColumn, expectedBasePath) => {
    mockedUseUserContext.mockReturnValue(
      createContext({ getCurrentUserSettings: () => buildSettingsWithEmptySortFor(settingsColumn) }),
    );

    render(
      <ReactTable
        columns={columns}
        data={[{ id: 15, artist: "Boards of Canada" }]}
        settingsColumn={settingsColumn}
      />,
    );

    fireEvent.click(screen.getByText("Boards of Canada"));

    expect(mockNavigate).toHaveBeenCalledWith(`${expectedBasePath}/15`);
  });

  it("persists sorting changes to user settings when a header is clicked", () => {
    const settingsWithNoPlaylogSort = {
      ...DefaultSettings,
      sortModels: {
        ...DefaultSettings.sortModels,
        playlogs: [],
      },
    };

    mockedUseUserContext.mockReturnValue(
      createContext({ getCurrentUserSettings: () => settingsWithNoPlaylogSort }),
    );

    render(
      <ReactTable
        columns={columns}
        data={[{ id: 1, artist: "Aphex Twin" }]}
        settingsColumn="playlogs"
      />,
    );

    fireEvent.click(screen.getByText("Artist"));

    expect(mockUpdateCurrentUserSettings).toHaveBeenCalledWith(
      expect.objectContaining({
        sortModels: expect.objectContaining({
          playlogs: [{ field: "artist", sort: "asc" }],
        }),
      }),
    );
  });
});
