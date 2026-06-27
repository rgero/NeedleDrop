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
});

afterEach(() => {
  mockUseParams.mockReset();
  mockUseLocation.mockReset();
});

describe("PlaylogForm", () => {
  it("shows the vinyl selection as required for creating a play", () => {
    render(<PlaylogForm />);

    expect(screen.getByText(/Vinyl Record/i)).toBeInTheDocument();
    expect(screen.getByText(/Required to create a play/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create/i })).toBeDisabled();
  });
});

describe("LocationForm", () => {
  it("shows validation errors when required fields are empty", async () => {
    render(<LocationForm />);

    fireEvent.click(screen.getByRole("button", { name: /create location/i }));

    expect(mockLocationContext.createLocation).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/location name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/address is required/i)).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith("Please fix the highlighted fields before saving.");
    });
  });
});

describe("VinylForm", () => {
  it("blocks save when artist and album are missing", async () => {
    render(<VinylForm />);

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(mockVinylContext.createVinyl).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/artist is required/i)).toBeInTheDocument();
      expect(screen.getByText(/album is required/i)).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith("Please fix the highlighted fields before saving.");
    });
  });
});

describe("WantItemForm", () => {
  it("blocks save when artist and album are missing", async () => {
    render(<WantItemForm />);

    fireEvent.click(screen.getByRole("button", { name: /create/i }));

    expect(mockWantedItemContext.createWantedItem).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByText(/artist is required/i)).toBeInTheDocument();
      expect(screen.getByText(/album is required/i)).toBeInTheDocument();
      expect(mockToast.error).toHaveBeenCalledWith("Please fix the highlighted fields before saving.");
    });
  });
});