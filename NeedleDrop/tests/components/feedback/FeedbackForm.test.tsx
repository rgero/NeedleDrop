import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import FeedbackForm from "@components/feedback/FeedbackForm";

const { mockAddFeedback, mockToast, mockToggleFeedbackOpen, mockUseCreateFeedback } = vi.hoisted(() => ({
  mockAddFeedback: vi.fn(),
  mockToast: { error: vi.fn() },
  mockToggleFeedbackOpen: vi.fn(),
  mockUseCreateFeedback: vi.fn(),
}));

vi.mock("@components/feedback/hooks/useCreateFeedback", () => ({
  useCreateFeedback: mockUseCreateFeedback,
}));

vi.mock("@context/dialog/DialogContext", () => ({
  useDialogProvider: () => ({ toggleFeedbackOpen: mockToggleFeedbackOpen }),
}));

vi.mock("react-hot-toast", () => ({ default: mockToast }));

vi.mock("@mui/icons-material", () => ({
  DoNotDisturb: () => null,
  ThumbUpAlt: () => null,
}));

describe("FeedbackForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseCreateFeedback.mockReturnValue({ isAdding: false, addFeedback: mockAddFeedback });
  });

  it("rejects an empty suggestion", () => {
    render(<FeedbackForm />);

    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    expect(mockToast.error).toHaveBeenCalledWith("Suggestion field cannot be empty");
    expect(mockAddFeedback).not.toHaveBeenCalled();
  });

  it("clears the suggestion and details", () => {
    render(<FeedbackForm />);
    const suggestion = screen.getByRole("textbox", { name: "Suggestion" });
    const details = screen.getByRole("textbox", { name: "Additional Details" });

    fireEvent.change(suggestion, { target: { value: "Add dark mode" } });
    fireEvent.change(details, { target: { value: "It would help with evening use." } });
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));

    expect(suggestion).toHaveValue("");
    expect(details).toHaveValue("");
    expect(screen.getByText(/0\s*\/\s*10,000/)).toBeInTheDocument();
  });

  it("submits feedback and clears the form after success", async () => {
    mockAddFeedback.mockImplementation((_feedback, options: { onSuccess: () => void }) => {
      options.onSuccess();
    });

    render(<FeedbackForm />);
    fireEvent.change(screen.getByRole("textbox", { name: "Suggestion" }), { target: { value: "Add dark mode" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Additional Details" }), { target: { value: "Please consider it." } });
    fireEvent.click(screen.getByRole("button", { name: "Submit" }));

    await waitFor(() => {
      expect(mockAddFeedback).toHaveBeenCalledWith(
        { title: "Add dark mode", description: "Please consider it." },
        expect.objectContaining({ onSuccess: expect.any(Function) }),
      );
      expect(mockToggleFeedbackOpen).toHaveBeenCalled();
      expect(screen.getByRole("textbox", { name: "Suggestion" })).toHaveValue("");
      expect(screen.getByRole("textbox", { name: "Additional Details" })).toHaveValue("");
    });
  });

  it("disables inputs while feedback is being added", () => {
    mockUseCreateFeedback.mockReturnValue({ isAdding: true, addFeedback: mockAddFeedback });

    render(<FeedbackForm />);

    expect(screen.getByRole("textbox", { name: "Suggestion" })).toBeDisabled();
    expect(screen.getByRole("textbox", { name: "Additional Details" })).toBeDisabled();
  });
});