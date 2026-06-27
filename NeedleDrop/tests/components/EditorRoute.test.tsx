import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";

import EditorRoute from "@components/EditorRoute";

const mockAuthenticationContext = vi.hoisted(() => ({
  user: { id: "user-1" } as { id: string } | null,
  isLoading: false,
}));

const mockUserContext = vi.hoisted(() => ({
  currentUser: { id: "user-1", name: "Editor", editor: true, settings: {} as never },
  isEditor: true,
  isLoading: false,
}));

vi.mock("@context/authentication/AuthenticationContext", () => ({
  useAuthenticationContext: () => mockAuthenticationContext,
}));

vi.mock("@context/users/UserContext", () => ({
  useUserContext: () => mockUserContext,
}));

describe("EditorRoute", () => {
  beforeEach(() => {
    mockAuthenticationContext.user = { id: "user-1" };
    mockAuthenticationContext.isLoading = false;
    mockUserContext.currentUser = { id: "user-1", name: "Editor", editor: true, settings: {} as never };
    mockUserContext.isEditor = true;
    mockUserContext.isLoading = false;
  });

  it.each([
    ["/vinyls/create", "/vinyls"],
    ["/plays/create", "/plays"],
    ["/locations/create", "/locations"],
    ["/wantlist/create", "/wantlist"],
  ] as const)("redirects non-editors from %s to %s", (requestedPath, expectedPath) => {
    mockUserContext.isEditor = false;
    mockUserContext.currentUser = { id: "user-1", name: "Reader", editor: false, settings: {} as never };

    render(
      <MemoryRouter initialEntries={[requestedPath]}>
        <Routes>
          <Route
            path="/vinyls/create"
            element={
              <EditorRoute>
                <div>vinyl create</div>
              </EditorRoute>
            }
          />
          <Route
            path="/plays/create"
            element={
              <EditorRoute>
                <div>play create</div>
              </EditorRoute>
            }
          />
          <Route
            path="/locations/create"
            element={
              <EditorRoute>
                <div>location create</div>
              </EditorRoute>
            }
          />
          <Route
            path="/wantlist/create"
            element={
              <EditorRoute>
                <div>want create</div>
              </EditorRoute>
            }
          />
          <Route path="/vinyls" element={<div>vinyls table</div>} />
          <Route path="/plays" element={<div>plays table</div>} />
          <Route path="/locations" element={<div>locations table</div>} />
          <Route path="/wantlist" element={<div>wantlist table</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.queryByText(/create/i)).not.toBeInTheDocument();
    expect(screen.getByText(/table/i)).toBeInTheDocument();
    expect(screen.getByText(expectedPath.replace("/", "") + " table")).toBeInTheDocument();
  });

  it("renders children for editors", () => {
    render(
      <MemoryRouter initialEntries={['/vinyls/create']}>
        <Routes>
          <Route
            path="/vinyls/create"
            element={
              <EditorRoute>
                <div>editor content</div>
              </EditorRoute>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("editor content")).toBeInTheDocument();
  });
});