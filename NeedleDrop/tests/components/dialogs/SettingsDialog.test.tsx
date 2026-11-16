import { beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import SettingsDialog from "@components/dialogs/SettingsDialog";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";

const mocks = vi.hoisted(() => ({
  useUserContext: vi.fn(),
  toggleSettingsDialog: vi.fn(),
}));

vi.mock("@context/users/UserContext", () => ({
  useUserContext: mocks.useUserContext,
}));

vi.mock("@context/dialog/DialogContext", () => ({
  useDialogProvider: () => ({
    settingsDialogOpen: true,
    toggleSettingsDialog: mocks.toggleSettingsDialog,
  }),
}));

describe("SettingsDialog", () => {
  const updateCurrentUserProfile = vi.fn();

  const renderDialog = (discordId: string | null, settings = DefaultSettings) => {
    mocks.useUserContext.mockReturnValue({
      isLoading: false,
      currentUser: { id: "user-1", name: "Alice", editor: false, settings, discord_id: discordId },
      getCurrentUserSettings: () => settings,
      updateCurrentUserSettings: vi.fn(),
      updateCurrentUserProfile,
    });

    return render(<SettingsDialog />);
  };

  beforeEach(() => {
    vi.clearAllMocks();
    updateCurrentUserProfile.mockResolvedValue(undefined);
  });

  it("masks the Discord ID until focus and hides it again on blur", () => {
    renderDialog("123456789012345678");
    const input = screen.getByLabelText("Discord ID");

    expect(input).toHaveAttribute("type", "password");

    fireEvent.focus(input);
    expect(input).toHaveAttribute("type", "text");

    fireEvent.blur(input);
    expect(input).toHaveAttribute("type", "password");
  });

  it("saves all edited fields together and closes on success", async () => {
    const updatedSettings = {
      ...DefaultSettings,
      pricePerPlayValue: !DefaultSettings.pricePerPlayValue,
    };
    renderDialog(null);

    fireEvent.change(screen.getByLabelText("Discord ID"), {
      target: { value: "123456789012345678" },
    });
    fireEvent.click(screen.getByRole("switch", { name: "Statistics calculation mode" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateCurrentUserProfile).toHaveBeenCalledWith(updatedSettings, "123456789012345678");
      expect(mocks.toggleSettingsDialog).toHaveBeenCalledOnce();
    });
  });

  it("allows removing a linked Discord ID as part of the form save", async () => {
    renderDialog("123456789012345678");

    fireEvent.change(screen.getByLabelText("Discord ID"), {
      target: { value: "" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    await waitFor(() => {
      expect(updateCurrentUserProfile).toHaveBeenCalledWith(DefaultSettings, null);
    });
  });

  it("rejects non-digit Discord IDs", () => {
    renderDialog(null);

    fireEvent.change(screen.getByLabelText("Discord ID"), {
      target: { value: "not-an-id" },
    });

    expect(screen.getByText("Enter a Discord ID using digits only.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    expect(updateCurrentUserProfile).not.toHaveBeenCalled();
  });

  it("shows a persistence error and keeps the dialog open", async () => {
    updateCurrentUserProfile.mockRejectedValue(new Error("Failed to update user profile"));
    renderDialog(null);

    fireEvent.change(screen.getByLabelText("Discord ID"), {
      target: { value: "123456789012345678" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Failed to update user profile")).toBeInTheDocument();
    expect(mocks.toggleSettingsDialog).not.toHaveBeenCalled();
  });

  it("closes immediately when there are no pending changes", () => {
    renderDialog(null);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(mocks.toggleSettingsDialog).toHaveBeenCalledOnce();
    expect(screen.queryByText("Discard unsaved changes?")).not.toBeInTheDocument();
  });

  it("asks before discarding pending changes", async () => {
    renderDialog(null);

    fireEvent.click(screen.getByRole("switch", { name: "Statistics calculation mode" }));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.getByText("Discard unsaved changes?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Keep editing" }));
    expect(mocks.toggleSettingsDialog).not.toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Close" })).toBeInTheDocument();
    });
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    fireEvent.click(screen.getByRole("button", { name: "Discard changes" }));

    expect(mocks.toggleSettingsDialog).toHaveBeenCalledOnce();
  });
});
