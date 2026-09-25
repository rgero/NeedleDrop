import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import FeedbackDialog from "@components/feedback/FeedbackDialog";

const { mockToggleFeedbackOpen, mockUseDialogProvider } = vi.hoisted(() => ({
  mockToggleFeedbackOpen: vi.fn(),
  mockUseDialogProvider: vi.fn(),
}));

vi.mock("@context/dialog/DialogContext", () => ({
  useDialogProvider: mockUseDialogProvider,
}));

vi.mock("@components/feedback/FeedbackForm", () => ({
  default: () => <div data-testid="feedback-form" />,
}));

describe("FeedbackDialog", () => {
  it("renders the feedback form when open and toggles on close", () => {
    mockUseDialogProvider.mockReturnValue({
      feedbackOpen: true,
      toggleFeedbackOpen: mockToggleFeedbackOpen,
    });

    render(<FeedbackDialog />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByTestId("feedback-form")).toBeInTheDocument();

    screen.getByRole("dialog").dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(mockToggleFeedbackOpen).toHaveBeenCalled();
  });

  it("does not show the dialog when feedback is closed", () => {
    mockUseDialogProvider.mockReturnValue({
      feedbackOpen: false,
      toggleFeedbackOpen: mockToggleFeedbackOpen,
    });

    render(<FeedbackDialog />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});