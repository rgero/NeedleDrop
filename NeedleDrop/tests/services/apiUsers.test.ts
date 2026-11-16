import { beforeEach, describe, expect, it, vi } from "vitest";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import { updateUserProfile } from "@services/apiUsers";

const { fromMock, updateMock, eqMock, selectMock, singleMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  updateMock: vi.fn(),
  eqMock: vi.fn(),
  selectMock: vi.fn(),
  singleMock: vi.fn(),
}));

vi.mock("@services/supabase", () => ({
  default: {
    from: fromMock,
  },
}));

describe("apiUsers", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    const chain = { update: updateMock, eq: eqMock, select: selectMock, single: singleMock };
    fromMock.mockReturnValue(chain);
    updateMock.mockReturnValue(chain);
    eqMock.mockReturnValue(chain);
    selectMock.mockReturnValue(chain);
    singleMock.mockResolvedValue({
      data: { id: "user-1", settings: DefaultSettings, discord_id: "123456789012345678" },
      error: null,
    });
  });

  it("updates settings and Discord ID together for the selected user", async () => {
    const settings = { ...DefaultSettings, timeZone: "America/New_York" };
    const updatedUser = await updateUserProfile("user-1", settings, "123456789012345678");

    expect(fromMock).toHaveBeenCalledWith("users");
    expect(updateMock).toHaveBeenCalledWith({ settings, discord_id: "123456789012345678" });
    expect(eqMock).toHaveBeenCalledWith("id", "user-1");
    expect(updatedUser).toMatchObject({ settings, discord_id: "123456789012345678" });
  });

  it("surfaces profile update failures", async () => {
    singleMock.mockResolvedValue({ data: null, error: { message: "Database unavailable" } });

    await expect(updateUserProfile("user-1", DefaultSettings, null)).rejects.toThrow("Failed to update user profile");
  });
});
