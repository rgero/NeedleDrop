import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { UserProvider } from "@context/users/UserProvider";
import { useUserContext } from "@context/users/UserContext";
import { getUsers } from "@services/apiUsers";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";

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
  const { currentUser, editorUsers, isEditor } = useUserContext();

  return (
    <div>
      <div data-testid="current-user">{currentUser?.name ?? "none"}</div>
      <div data-testid="editor-users">{editorUsers.map((user) => user.name).join(",")}</div>
      <div data-testid="is-editor">{String(isEditor)}</div>
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
});