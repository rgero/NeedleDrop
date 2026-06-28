import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import StatsPage from "@pages/stats/StatsPage";
import { useUserContext } from "@context/users/UserContext";

vi.mock("@components/stats/UserStats", () => ({
  default: () => <div data-testid="user-stats">User Stats</div>,
}));

vi.mock("@components/stats/HouseholdStats", () => ({
  default: () => <div data-testid="household-stats">Household Stats</div>,
}));

vi.mock("@components/ui/Loading", () => ({
  default: () => <div>Loading...</div>,
}));

vi.mock("@context/users/UserContext", () => ({
  useUserContext: vi.fn(),
}));

const mockedUseUserContext = useUserContext as unknown as ReturnType<typeof vi.fn>;

describe("StatsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("only shows household stats for non-editors", () => {
    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: false,
      isLoading: false,
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(() => ({ currentStatsTab: "1" })),
      updateCurrentUserSettings: vi.fn(),
    });

    render(<StatsPage />);

    expect(screen.queryByRole("tab", { name: /user/i })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /household/i })).toBeInTheDocument();
    expect(screen.getByTestId("household-stats")).toBeInTheDocument();
    expect(screen.queryByTestId("user-stats")).not.toBeInTheDocument();
  });

  it("shows both tabs for editors and updates the selected tab", () => {
    let savedTab = "1";
    const updateCurrentUserSettings = vi.fn();

    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: true,
      isLoading: false,
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(() => ({ currentStatsTab: savedTab })),
      updateCurrentUserSettings: (updates: { currentStatsTab?: string }) => {
        if (updates.currentStatsTab) {
          savedTab = updates.currentStatsTab;
        }
        updateCurrentUserSettings(updates);
      },
    });

    render(<StatsPage />);

    expect(screen.getByRole("tab", { name: /user/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /household/i })).toBeInTheDocument();
    expect(screen.getByTestId("user-stats")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /household/i }));

    expect(screen.getByTestId("household-stats")).toBeInTheDocument();
    expect(updateCurrentUserSettings).toHaveBeenCalledWith({ currentStatsTab: "2" });
  });

  it("renders stats without loading state blocking (Suspense refactoring)", () => {
    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: true,
      isLoading: true, // isLoading is now true, but page should still render
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(() => ({ currentStatsTab: "1" })),
      updateCurrentUserSettings: vi.fn(),
    });

    render(<StatsPage />);

    // With Suspense refactoring, the page should render even with isLoading: true
    // The stats components handle their own Suspense boundaries
    expect(screen.getByRole("tab", { name: /user/i })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: /household/i })).toBeInTheDocument();
  });

  it("renders user stats with Suspense wrapper for progressive loading", () => {
    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: true,
      isLoading: false,
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(() => ({ currentStatsTab: "1" })),
      updateCurrentUserSettings: vi.fn(),
    });

    render(<StatsPage />);

    // UserStats is now wrapped with SuspenseStatsWrapper
    expect(screen.getByTestId("user-stats")).toBeInTheDocument();
  });

  it("renders household stats with Suspense wrapper for progressive loading", async () => {
    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: true,
      isLoading: false,
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(() => ({ currentStatsTab: "2" })),
      updateCurrentUserSettings: vi.fn(),
    });

    render(<StatsPage />);

    // HouseholdStats is now wrapped with SuspenseStatsWrapper
    expect(screen.getByTestId("household-stats")).toBeInTheDocument();
  });

  it("handles tab switching without blocking on loading state", () => {
    let savedTab = "1";
    const updateCurrentUserSettings = vi.fn();

    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: true,
      isLoading: true, // Simulating ongoing data fetch
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(() => ({ currentStatsTab: savedTab })),
      updateCurrentUserSettings: (updates: { currentStatsTab?: string }) => {
        if (updates.currentStatsTab) {
          savedTab = updates.currentStatsTab;
        }
        updateCurrentUserSettings(updates);
      },
    });

    render(<StatsPage />);

    // Should be able to interact with tabs even while loading
    expect(screen.getByRole("tab", { name: /household/i })).toBeEnabled();
    fireEvent.click(screen.getByRole("tab", { name: /household/i }));

    expect(updateCurrentUserSettings).toHaveBeenCalledWith({ currentStatsTab: "2" });
  });
});