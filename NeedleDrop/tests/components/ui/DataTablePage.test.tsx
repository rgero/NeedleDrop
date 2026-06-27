import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import DataTablePage from "@components/ui/DataTablePage";
import { useUserContext } from "@context/users/UserContext";

vi.mock("@context/users/UserContext", () => ({
  useUserContext: vi.fn(),
}));

vi.mock("@mui/icons-material", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@mui/icons-material")>();
  return {
    ...actual,
    AddCircle: () => <svg data-testid="add-circle" />,
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

const mockedUseUserContext = useUserContext as unknown as ReturnType<typeof vi.fn>;

describe("DataTablePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: false,
      isLoading: false,
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(),
      updateCurrentUserSettings: vi.fn(),
    });
  });

  it("hides the create button for non-editors", () => {
    render(
      <DataTablePage title="Vinyls">
        <div>table body</div>
      </DataTablePage>,
    );

    expect(screen.getByText("Vinyls")).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("navigates to the create route for editors", () => {
    mockedUseUserContext.mockReturnValue({
      users: [],
      editorUsers: [],
      currentUser: null,
      isEditor: true,
      isLoading: false,
      isFetching: false,
      error: null,
      getCurrentUserSettings: vi.fn(),
      updateCurrentUserSettings: vi.fn(),
    });

    render(
      <DataTablePage title="Vinyls">
        <div>table body</div>
      </DataTablePage>,
    );

    fireEvent.click(screen.getByRole("button"));

    expect(mockNavigate).toHaveBeenCalledWith("/vinyls/create");
  });
});