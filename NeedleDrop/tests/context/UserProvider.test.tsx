import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { UserProvider } from "@context/users/UserProvider";
import { useUserContext } from "@context/users/UserContext";
import { getUsers, updateUserSettings } from "@services/apiUsers";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import type { VinylSettings } from "@interfaces/settings/tables/VinylSettings";

vi.mock("@services/apiUsers", () => ({
  getUsers: vi.fn(),
  updateUserSettings: vi.fn(),
}));

vi.mock("@context/authentication/AuthenticationContext", () => ({
  useAuthenticationContext: vi.fn(),
}));

const mockedUseAuthenticationContext = useAuthenticationContext as unknown as ReturnType<typeof vi.fn>;
const mockedGetUsers = getUsers as unknown as ReturnType<typeof vi.fn>;

const TestConsumer = () => {
  const { currentUser, editorUsers, getCurrentUserSettings, updateCurrentUserSettings, isEditor } = useUserContext();

  return (
    <div>
      <div data-testid="current-user">{currentUser?.name ?? "none"}</div>
      <div data-testid="editor-users">{editorUsers.map((user) => user.name).join(",")}</div>
      <div data-testid="is-editor">{String(isEditor)}</div>
      <div data-testid="stats-start-date">{getCurrentUserSettings()?.statsStartDate}</div>
      <div data-testid="vinyls-release-date">{String(getCurrentUserSettings()?.vinyls.releaseDate)}</div>
      <div data-testid="filter-layout">{JSON.stringify(getCurrentUserSettings()?.tableFilterLayouts)}</div>
      <button onClick={() => updateCurrentUserSettings({
        tableFilterLayouts: {
          ...DefaultSettings.tableFilterLayouts,
          vinyls: { order: ["artist"], collapsed: ["artist"] },
        },
      })}>Save filter layout</button>
    </div>
  );
};

describe("UserProvider", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
    mockedUseAuthenticationContext.mockReturnValue({ user: { id: "user-1" } });
  });

  it("maps the current auth user to the users table and filters editor users", async () => {
    mockedGetUsers.mockResolvedValue([
      { id: "user-1", name: "Alice", editor: false, settings: DefaultSettings },
      { id: "user-2", name: "Bob", editor: true, settings: DefaultSettings },
      { id: "user-3", name: "Carol", editor: true, settings: DefaultSettings },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <TestConsumer />
        </UserProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-user")).toHaveTextContent("Alice");
    });

    expect(screen.getByTestId("is-editor")).toHaveTextContent("false");
    expect(screen.getByTestId("editor-users")).toHaveTextContent("Bob,Carol");
  });

  it("fills a missing stats start date from the default settings", async () => {
    const { statsStartDate: _statsStartDate, ...settingsWithoutStartDate } = DefaultSettings;
    mockedGetUsers.mockResolvedValue([
      { id: "user-1", name: "Alice", editor: false, settings: settingsWithoutStartDate },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <TestConsumer />
        </UserProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-user")).toHaveTextContent("Alice");
    });

    expect(screen.getByTestId("stats-start-date")).toHaveTextContent(DefaultSettings.statsStartDate);
  });

  it("fills newly added table columns from the default settings", async () => {
    const vinylsWithoutReleaseDate: Partial<VinylSettings> = { ...DefaultSettings.vinyls };
    delete vinylsWithoutReleaseDate.releaseDate;
    mockedGetUsers.mockResolvedValue([
      {
        id: "user-1",
        name: "Alice",
        editor: false,
        settings: { ...DefaultSettings, vinyls: vinylsWithoutReleaseDate },
      },
    ]);

    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <TestConsumer />
        </UserProvider>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("current-user")).toHaveTextContent("Alice");
    });

    expect(screen.getByTestId("vinyls-release-date")).toHaveTextContent("false");
  });

  it("defaults legacy filter layouts and persists layout updates through the settings API", async () => {
    const legacySettings = structuredClone(DefaultSettings);
    Reflect.deleteProperty(legacySettings, "tableFilterLayouts");
    const user = { id: "user-1", name: "Alice", editor: false, settings: legacySettings };
    mockedGetUsers.mockResolvedValue([user]);
    vi.mocked(updateUserSettings).mockImplementation(async (_id, settings) => ({
      ...user,
      settings: { ...DefaultSettings, ...settings },
    }));
    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider><TestConsumer /></UserProvider>
      </QueryClientProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("current-user")).toHaveTextContent("Alice"));
    expect(screen.getByTestId("filter-layout")).toHaveTextContent(JSON.stringify(DefaultSettings.tableFilterLayouts));
    fireEvent.click(screen.getByRole("button", { name: "Save filter layout" }));
    await waitFor(() => expect(updateUserSettings).toHaveBeenCalledWith("user-1", {
      ...legacySettings,
      tableFilterLayouts: {
        ...DefaultSettings.tableFilterLayouts,
        vinyls: { order: ["artist"], collapsed: ["artist"] },
      },
    }));
    expect(screen.getByTestId("filter-layout")).toHaveTextContent('"collapsed":["artist"]');
  });

  it("rolls back a filter layout when saving settings fails", async () => {
    mockedGetUsers.mockResolvedValue([
      { id: "user-1", name: "Alice", editor: false, settings: structuredClone(DefaultSettings) },
    ]);
    vi.mocked(updateUserSettings).mockRejectedValue(new Error("Failed to update user settings"));
    render(
      <QueryClientProvider client={queryClient}>
        <UserProvider><TestConsumer /></UserProvider>
      </QueryClientProvider>,
    );
    await waitFor(() => expect(screen.getByTestId("current-user")).toHaveTextContent("Alice"));
    fireEvent.click(screen.getByRole("button", { name: "Save filter layout" }));
    await waitFor(() => expect(updateUserSettings).toHaveBeenCalledOnce());
    await waitFor(() => expect(screen.getByTestId("filter-layout")).toHaveTextContent(JSON.stringify(DefaultSettings.tableFilterLayouts)));
  });
});