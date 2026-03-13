import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

import { AuthenticationProvider } from "@context/authentication/AuthenticationProvider";
import { getCurrentUser } from "@services/apiAuthentication";
import supabase from "@services/supabase";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";

vi.mock("@services/apiAuthentication", () => ({
  getCurrentUser: vi.fn(),
  logout: vi.fn(),
  signInWithGoogle: vi.fn(),
}));

vi.mock("@services/supabase", () => ({
  default: {
    auth: {
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } },
      })),
    },
  },
}));

const TestConsumer = () => {
  const { user, isLoading } = useAuthenticationContext();
  if (isLoading) return <div data-testid="loading">Loading...</div>;
  return <div data-testid="user">{user ? user.email : "Guest"}</div>;
};

describe("AuthenticationProvider", () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    vi.clearAllMocks();
  });

  it("shows loading state initially and then the user data", async () => {
    const mockUser = { email: "roy@example.com" } as User;
    vi.mocked(getCurrentUser).mockResolvedValue(mockUser);

    render(
      <QueryClientProvider client={queryClient}>
        <AuthenticationProvider>
          <TestConsumer />
        </AuthenticationProvider>
      </QueryClientProvider>
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("roy@example.com");
    });
  });

  it("updates the user data when Supabase auth state changes", async () => {
    vi.mocked(getCurrentUser).mockResolvedValue(null);
    
    // 1. Define the callback type correctly using Supabase types
    let authCallback: (event: AuthChangeEvent, session: Session | null) => void;
    
    // 2. Mock implementation using vi.mocked to avoid 'any'
    vi.mocked(supabase.auth.onAuthStateChange).mockImplementation((cb) => {
      authCallback = cb;
      return {
        data: { subscription: { unsubscribe: vi.fn() } }
      } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>;
    });

    render(
      <QueryClientProvider client={queryClient}>
        <AuthenticationProvider>
          <TestConsumer />
        </AuthenticationProvider>
      </QueryClientProvider>
    );

    await waitFor(() => expect(screen.getByTestId("user")).toHaveTextContent("Guest"));

    // 3. Trigger with typed arguments
    // @ts-expect-error - we know authCallback is defined after render
    authCallback("SIGNED_IN", { user: { email: "new-login@example.com" } } as Session);

    await waitFor(() => {
      expect(screen.getByTestId("user")).toHaveTextContent("new-login@example.com");
    });
  });

  it("unsubscribes from auth changes on unmount", () => {
    const unsubscribeMock = vi.fn();
    
    vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
      data: { subscription: { unsubscribe: unsubscribeMock } },
    } as unknown as ReturnType<typeof supabase.auth.onAuthStateChange>);

    const { unmount } = render(
      <QueryClientProvider client={queryClient}>
        <AuthenticationProvider>
          <TestConsumer />
        </AuthenticationProvider>
      </QueryClientProvider>
    );

    unmount();
    expect(unsubscribeMock).toHaveBeenCalled();
  });
});