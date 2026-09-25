import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { createElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import { useCreateFeedback } from "@components/feedback/hooks/useCreateFeedback";

const { mockSubmitFeedback, mockToast } = vi.hoisted(() => ({
  mockSubmitFeedback: vi.fn(),
  mockToast: { error: vi.fn(), success: vi.fn() },
}));

vi.mock("@services/apiGithubLogger", () => ({
  submitFeedback: mockSubmitFeedback,
}));

vi.mock("react-hot-toast", () => ({ default: mockToast }));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  });

  return ({ children }: { children: ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children);
};

describe("useCreateFeedback", () => {
  it("submits feedback and shows a success toast", async () => {
    mockSubmitFeedback.mockResolvedValue(undefined);
    const { result } = renderHook(() => useCreateFeedback(), { wrapper: createWrapper() });

    result.current.addFeedback({ title: "Add dark mode", description: "Please consider it." });

    await waitFor(() => {
      expect(mockSubmitFeedback).toHaveBeenCalledWith({
        title: "Add dark mode",
        description: "Please consider it.",
      });
      expect(mockToast.success).toHaveBeenCalledWith("Feedback Submitted");
      expect(result.current.isAdding).toBe(false);
    });
  });

  it("shows an Error message when submission fails with an Error", async () => {
    mockSubmitFeedback.mockRejectedValue(new Error("Network unavailable"));
    const { result } = renderHook(() => useCreateFeedback(), { wrapper: createWrapper() });

    result.current.addFeedback({ title: "Add dark mode", description: "Please consider it." });

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Network unavailable");
    });
  });

  it("uses the fallback message for non-Error failures", async () => {
    mockSubmitFeedback.mockRejectedValue("offline");
    const { result } = renderHook(() => useCreateFeedback(), { wrapper: createWrapper() });

    result.current.addFeedback({ title: "Add dark mode", description: "Please consider it." });

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Failed to submit feedback");
    });
  });
});