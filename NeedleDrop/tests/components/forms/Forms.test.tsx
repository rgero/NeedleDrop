import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import LocationForm from "@components/locations/LocationForm";
import PlaylogForm from "@components/playlog/PlaylogForm";
import VinylForm from "@components/vinyls/VinylForm";
import WantItemForm from "@components/wanted/WantItemForm";

const {
  mockNavigate,
  mockUseParams,
  mockUseLocation,
  mockToast,
  mockOpenDeleteDialog,
} = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
  mockUseParams: vi.fn(),
  mockUseLocation: vi.fn(),
  mockToast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  mockOpenDeleteDialog: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
    useLocation: () => mockUseLocation(),
  };
});

vi.mock("react-hot-toast", () => ({
  default: mockToast,
}));

vi.mock("@components/ui/FormHeader", () => ({
  default: ({ isCreateMode, rightAdornment }: { isCreateMode: boolean; rightAdornment?: React.ReactNode }) => (
    <div data-testid="form-header">
      {isCreateMode ? "Add New" : "Details"}
      {rightAdornment}
    </div>
  ),
}));

vi.mock("@components/ui/FloatingAction", () => ({
  default: ({ fallbackPath }: { fallbackPath: string }) => <div data-testid="floating-action">{fallbackPath}</div>,
}));

vi.mock("@components/ui/AlbumImagePresenter", () => ({
  default: () => <div data-testid="album-image-presenter" />,
}));

vi.mock("@vis.gl/react-google-maps", () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock("@components/locations/AddressSearchMap", () => ({
  AddressSearchMap: ({
    disabled,
    error,
    helperText,
    onAddressSelect,
  }: {
    disabled: boolean;
    error?: boolean;
    helperText?: string;
    onAddressSelect: (address: string, lat: number, lng: number) => void;
  }) => (
    <div>
      <input
        aria-label="address-search-mock"
        disabled={disabled}
        onChange={(event) => onAddressSelect(event.target.value, 0, 0)}
      />
      {error && <div>{helperText}</div>}
    </div>
  ),
}));

const mockPlaylogContext = {
  isLoading: false,
  getPlaylogById: vi.fn(() => null),
  updatePlaylog: vi.fn(),
  createPlaylog: vi.fn(),
  deletePlaylog: vi.fn(),
};

const mockVinylContext = {
  isLoading: false,
  vinyls: [
    {
      id: 1,
      artist: "Boards of Canada",
      album: "Music Has the Right to Children",
      purchaseDate: new Date(),
      purchaseLocation: null,
      owners: [],
      purchasedBy: [],
      length: 0,
      likedBy: [],
      doubleLP: false,
      tags: [],
      price: 0,
    },
  ],
  getVinylById: vi.fn(() => null),
  updateVinyl: vi.fn(),
  createVinyl: vi.fn(),
  deleteVinyl: vi.fn(),
  getVinylsOwnedByUserId: vi.fn(),
  getVinylsBoughtByUserId: vi.fn(),
  calculateValueById: vi.fn(),
  calculateTotalSpentById: vi.fn(),
  calculateTotalPrice: vi.fn(),
  unplayedVinyls: [],
  isFetching: false,
  error: null,
};

const mockLocationContext = {
  isLoading: false,
  locations: [],
  getLocationById: vi.fn(() => null),
  updateLocation: vi.fn(),
  createLocation: vi.fn(),
  deleteLocation: vi.fn(),
  isFetching: false,
  error: null,
};

const mockUserContext = {
  isLoading: false,
  isFetching: false,
  error: null,
  users: [],
  editorUsers: [],
  currentUser: { id: "user-1", name: "Test User", editor: true, settings: {} as never },
  isEditor: true,
  getCurrentUserSettings: vi.fn(),
  updateCurrentUserSettings: vi.fn(),
};

const mockWantedItemContext = {
  isLoading: false,
  wanteditems: [],
  getWantedItemById: vi.fn(() => null),
  updateWantedItem: vi.fn(),
  createWantedItem: vi.fn(),
  deleteWantedItem: vi.fn(),
  isFetching: false,
  error: null,
};

vi.mock("@context/dialog/DialogContext", () => ({
  useDialogProvider: () => ({ openDeleteDialog: mockOpenDeleteDialog }),
}));

vi.mock("@context/playlogs/PlaylogContext", () => ({
  usePlaylogContext: () => mockPlaylogContext,
}));

vi.mock("@context/vinyl/VinylContext", () => ({
  useVinylContext: () => mockVinylContext,
}));

vi.mock("@context/location/LocationContext", () => ({
  useLocationContext: () => mockLocationContext,
}));

vi.mock("@context/users/UserContext", () => ({
  useUserContext: () => mockUserContext,
}));

vi.mock("@context/wanted/WantedItemContext", () => ({
  useWantedItemContext: () => mockWantedItemContext,
}));

vi.mock("@context/authentication/AuthenticationContext", () => ({
  useAuthenticationContext: () => ({ user: { id: "user-1" } }),
}));

vi.mock("@services/apiVinyls", () => ({
  getVinyls: vi.fn(),
  getUnplayedVinyls: vi.fn(),
  createVinyl: vi.fn(),
  updateVinyl: vi.fn(),
  deleteVinyl: vi.fn(),
}));

vi.mock("@services/apiPlaylogs", () => ({
  getPlaylogs: vi.fn(),
  createPlaylog: vi.fn(),
  updatePlaylog: vi.fn(),
  deletePlaylog: vi.fn(),
}));

vi.mock("@services/apiLocations", () => ({
  getLocations: vi.fn(),
  createLocation: vi.fn(),
  updateLocation: vi.fn(),
  deleteLocation: vi.fn(),
}));

vi.mock("@services/apiWantedItems", () => ({
  getWantedItems: vi.fn(),
  createWantedItem: vi.fn(),
  updateWantedItem: vi.fn(),
  deleteWantedItem: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: "new" });
  mockUseLocation.mockReturnValue({ state: null });
  mockUserContext.isEditor = true;
  mockUserContext.currentUser = { id: "user-1", name: "Test User", editor: true, settings: {} as never };
  mockVinylContext.getVinylById.mockReturnValue(null);
});

afterEach(() => {
  mockUseParams.mockReset();
  mockUseLocation.mockReset();
  mockUserContext.isEditor = true;
  mockUserContext.currentUser = { id: "user-1", name: "Test User", editor: true, settings: {} as never };
  mockVinylContext.getVinylById.mockReturnValue(null);
});

describe("PlaylogForm", () => {
  it("shows the vinyl selection as required for creating a play", () => {
    render(<PlaylogForm />);

    expect(screen.getByText(/Vinyl Record/i)).toBeInTheDocument();
    expect(screen.getByText(/Required to create a play/i)).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /create/i })[1]).toBeDisabled();
  });
});

describe("LocationForm", () => {
  it("shows validation errors when required fields are empty", async () => {
    render(<LocationForm />);

    fireEvent.click(screen.getAllByRole("button", { name: /create/i })[1]);

    expect(mockLocationContext.createLocation).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/location name is required/i)).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith("Please fix the highlighted fields before saving.");
    });
  });
});

describe("VinylForm", () => {
  it.each(["2011-03-15", ""])("updates an existing vinyl's release date to '%s'", async (value) => {
    const vinyl = {
      ...mockVinylContext.vinyls[0],
      releaseDate: new Date("1998-04-20T12:00:00"),
    };
    const { container } = render(<VinylForm vinyl={vinyl} />);
    const releaseDateInput = container.querySelectorAll('input[type="date"]')[1];

    expect(releaseDateInput).toHaveValue("1998-04-20");
    expect(releaseDateInput).toBeDisabled();
    fireEvent.click(screen.getAllByRole("button", { name: /^edit$/i })[0]);
    expect(releaseDateInput).toBeEnabled();
    fireEvent.change(releaseDateInput, { target: { value } });
    fireEvent.click(screen.getAllByRole("button", { name: /^save$/i })[0]);

    await waitFor(() => {
      expect(mockVinylContext.updateVinyl).toHaveBeenCalledWith(vinyl.id, expect.objectContaining({
        releaseDate: value ? new Date(`${value}T00:00:00`) : null,
      }));
      expect(releaseDateInput).toBeDisabled();
    });
  });

  it("restores the original release date when editing is canceled", () => {
    const vinyl = {
      ...mockVinylContext.vinyls[0],
      releaseDate: new Date("1998-04-20T12:00:00"),
    };
    const { container } = render(<VinylForm vinyl={vinyl} />);
    const releaseDateInput = container.querySelectorAll('input[type="date"]')[1];

    fireEvent.click(screen.getAllByRole("button", { name: /^edit$/i })[0]);
    fireEvent.change(releaseDateInput, { target: { value: "2011-03-15" } });
    fireEvent.click(screen.getAllByRole("button", { name: /^cancel$/i })[0]);

    expect(releaseDateInput).toHaveValue("1998-04-20");
    expect(releaseDateInput).toBeDisabled();
    expect(mockVinylContext.updateVinyl).not.toHaveBeenCalled();
  });

  it("resets edits and validation errors when a different vinyl arrives", () => {
    const vinyl = {
      ...mockVinylContext.vinyls[0],
      releaseDate: new Date("1998-04-20T12:00:00"),
    };
    const { container, rerender } = render(<VinylForm vinyl={vinyl} />);

    fireEvent.click(screen.getAllByRole("button", { name: /^edit$/i })[0]);
    fireEvent.change(screen.getByPlaceholderText("Enter artist name"), { target: { value: "" } });
    fireEvent.click(screen.getAllByRole("button", { name: /^save$/i })[0]);
    expect(screen.getByText("Artist is required.")).toBeInTheDocument();

    rerender(<VinylForm vinyl={{
      ...vinyl,
      id: 2,
      artist: "Rise Against",
      album: "Endgame",
      releaseDate: new Date("2011-03-15T12:00:00"),
    }} />);

    expect(screen.getByPlaceholderText("Enter artist name")).toHaveValue("Rise Against");
    expect(screen.getByPlaceholderText("Enter album name")).toHaveValue("Endgame");
    expect(container.querySelectorAll('input[type="date"]')[1]).toHaveValue("2011-03-15");
    expect(screen.getByPlaceholderText("Enter artist name")).toBeDisabled();
    expect(screen.queryByText("Artist is required.")).not.toBeInTheDocument();
    expect(mockVinylContext.updateVinyl).not.toHaveBeenCalled();
  });

  it.each([
    ["purchaseDate", 0],
    ["releaseDate", 1],
  ] as const)("allows clearing and re-entering %s", async (field, index) => {
    const { container } = render(<VinylForm />);
    const dateInput = container.querySelectorAll('input[type="date"]')[index];

    fireEvent.change(screen.getByPlaceholderText("Enter artist name"), { target: { value: "Test Artist" } });
    fireEvent.change(screen.getByPlaceholderText("Enter album name"), { target: { value: "Test Album" } });
    fireEvent.change(dateInput, { target: { value: "" } });

    expect(dateInput).toHaveValue("");
    fireEvent.click(screen.getAllByRole("button", { name: /create/i })[1]);

    await waitFor(() => {
      expect(mockVinylContext.createVinyl).toHaveBeenLastCalledWith(expect.objectContaining({ [field]: null }));
    });

    fireEvent.change(dateInput, { target: { value: "2026-10-30" } });
    expect(dateInput).toHaveValue("2026-10-30");
    fireEvent.click(screen.getAllByRole("button", { name: /create/i })[1]);

    await waitFor(() => {
      expect(mockVinylContext.createVinyl).toHaveBeenLastCalledWith(expect.objectContaining({
        [field]: new Date("2026-10-30T00:00:00"),
      }));
    });
  });

  it("renders invalid date values without crashing", () => {
    const { container } = render(<VinylForm vinyl={{
      ...mockVinylContext.vinyls[0],
      purchaseDate: new Date(NaN),
      releaseDate: new Date(NaN),
    }} />);

    for (const dateInput of container.querySelectorAll('input[type="date"]')) {
      expect(dateInput).toHaveValue("");
    }
  });

  it("blocks save when artist and album are missing", async () => {
    render(<VinylForm />);

    fireEvent.click(screen.getAllByRole("button", { name: /create/i })[1]);

    expect(mockVinylContext.createVinyl).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/artist is required/i)).toBeInTheDocument();
      expect(screen.getByText(/album is required/i)).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith("Please fix the highlighted fields before saving.");
    });
  });

  it("hides edit controls for non-editors on detail pages", async () => {
    mockUseParams.mockReturnValue({ id: "1" });
    mockUserContext.isEditor = false;
    mockUserContext.currentUser = { id: "user-1", name: "Test User", editor: false, settings: {} as never };
    mockVinylContext.getVinylById.mockReturnValue({
      id: 1,
      artist: "Boards of Canada",
      album: "Music Has the Right to Children",
      color: "Black",
      price: 0,
      purchaseDate: new Date(),
      purchaseLocation: null,
      purchasedBy: [],
      owners: [],
      notes: "",
      length: 0,
      likedBy: [],
      imageUrl: "",
      doubleLP: false,
      tags: [],
    } as never);

    render(<VinylForm />);

    await waitFor(() => {
      expect(screen.queryByRole("button", { name: /edit/i })).not.toBeInTheDocument();
    });
  });
});

describe("WantItemForm", () => {
  it("blocks save when artist and album are missing", async () => {
    render(<WantItemForm />);

    fireEvent.click(screen.getAllByRole("button", { name: /create/i })[1]);

    expect(mockWantedItemContext.createWantedItem).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/artist is required/i)).toBeInTheDocument();
      expect(screen.getByText(/album is required/i)).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith("Please fix the highlighted fields before saving.");
    });
  });

  it("saves the optional length value", async () => {
    render(<WantItemForm />);

    fireEvent.change(screen.getByRole("spinbutton"), { target: { value: "42" } });
    fireEvent.change(screen.getAllByRole("textbox")[0], { target: { value: "Massive Attack" } });
    fireEvent.change(screen.getAllByRole("textbox")[1], { target: { value: "Mezzanine" } });
    fireEvent.click(screen.getAllByRole("button", { name: /create/i })[1]);

    await waitFor(() => {
      expect(mockWantedItemContext.createWantedItem).toHaveBeenCalledWith(
        expect.objectContaining({ length: 42 }),
      );
    });
  });

  it("passes length when converting a wanted item to a vinyl", () => {
    const wantedItem = {
      id: 7,
      artist: "Massive Attack",
      album: "Mezzanine",
      searcher: [],
      notes: "Keep sealed",
      length: 42,
      imageUrl: "cover.jpg",
      weight: "High" as const,
      created_at: new Date(),
    };

    render(<WantItemForm wantedItem={wantedItem} />);

    fireEvent.click(screen.getByRole("button", { name: /convert to vinyl/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/vinyls/create", {
      state: {
        fromWantItem: {
          wantedID: 7,
          artist: "Massive Attack",
          album: "Mezzanine",
          notes: "Keep sealed",
          length: 42,
          imageUrl: "cover.jpg",
        },
      },
    });
  });
});