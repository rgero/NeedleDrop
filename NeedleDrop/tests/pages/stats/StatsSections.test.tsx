import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import PlayStats from "@components/stats/sections/playlogs/PlayStats";
import type { Stats } from "@interfaces/Stats";
import VinylOwnership from "@components/stats/sections/vinyls/VinylOwnership";

const { mockUseUserContext } = vi.hoisted(() => ({
  mockUseUserContext: vi.fn(),
}));

vi.mock("@context/users/UserContext", () => ({
  useUserContext: mockUseUserContext,
}));

const stats: Stats = {
  totalOwned: 20,
  totalBought: 8,
  collectionValue: 300,
  pricePaid: 120,
  topArtists: {},
  playlogs: [],
  totalPlays: 4,
  topPlayDays: {},
  playsByDays: {},
  playsByMonths: {},
  playsByAlbum: {},
  playsByArtist: {},
  topLocations: {},
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2024-01-11T12:00:00"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("VinylOwnership", () => {
  it("shows editor financial metrics and calculates records per day", () => {
    mockUseUserContext.mockReturnValue({
      isEditor: true,
      getCurrentUserSettings: () => ({ statsStartDate: "2024-01-01T12:00:00" }),
    });

    render(<VinylOwnership stats={stats} expanded onToggle={vi.fn()} />);

    expect(screen.getByText("Collection Value")).toBeInTheDocument();
    expect(screen.getByText("$300.00")).toBeInTheDocument();
    expect(screen.getByText("Total Spent")).toBeInTheDocument();
    expect(screen.getByText("$120.00")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("0.8")).toBeInTheDocument();
  });

  it("hides financial metrics from non-editors", () => {
    mockUseUserContext.mockReturnValue({
      isEditor: false,
      getCurrentUserSettings: () => ({ statsStartDate: "2024-01-01T12:00:00" }),
    });

    render(<VinylOwnership stats={stats} expanded onToggle={vi.fn()} />);

    expect(screen.queryByText("Collection Value")).not.toBeInTheDocument();
    expect(screen.queryByText("$300.00")).not.toBeInTheDocument();
    expect(screen.queryByText("Total Spent")).not.toBeInTheDocument();
    expect(screen.queryByText("$120.00")).not.toBeInTheDocument();
  });
});

describe("PlayStats", () => {
  it.each([
    { pricePerPlayValue: true, expectedCost: "$75.00" },
    { pricePerPlayValue: false, expectedCost: "$30.00" },
  ])("uses the configured value for cost per play ($expectedCost)", ({ pricePerPlayValue, expectedCost }) => {
    mockUseUserContext.mockReturnValue({
      isEditor: true,
      getCurrentUserSettings: () => ({ pricePerPlayValue }),
    });

    render(<PlayStats stats={stats} expanded onToggle={vi.fn()} />);

    expect(screen.getByText("Cost Per Play")).toBeInTheDocument();
    expect(screen.getByText(expectedCost)).toBeInTheDocument();
  });

  it("hides cost per play from non-editors", () => {
    mockUseUserContext.mockReturnValue({
      isEditor: false,
      getCurrentUserSettings: () => ({ pricePerPlayValue: true }),
    });

    render(<PlayStats stats={stats} expanded onToggle={vi.fn()} />);

    expect(screen.queryByText("Cost Per Play")).not.toBeInTheDocument();
    expect(screen.queryByText("$75.00")).not.toBeInTheDocument();
  });
});