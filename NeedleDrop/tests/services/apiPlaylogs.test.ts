import { beforeEach, describe, expect, it, vi } from "vitest";
import { createPlaylog, getPlaylogs, updatePlaylog } from "@services/apiPlaylogs";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";

const { fromMock, selectMock, insertMock, updateMock, eqMock, singleMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  selectMock: vi.fn(),
  insertMock: vi.fn(),
  updateMock: vi.fn(),
  eqMock: vi.fn(),
  singleMock: vi.fn(),
}));

vi.mock("@services/supabase", () => ({ default: { from: fromMock } }));

describe("apiPlaylogs", () => {
  const user = { id: "user-1", name: "Listener", editor: false, settings: DefaultSettings };
  const row = {
    id: 1,
    play_number: 3,
    album_id: 12,
    date: "2026-01-01T00:00:00.000Z",
    notes: "Evening spin",
    listeners: [user.id],
  };

  beforeEach(() => {
    vi.resetAllMocks();
    const chain = { select: selectMock, insert: insertMock, update: updateMock, eq: eqMock, single: singleMock };
    fromMock.mockReturnValue(chain);
    selectMock.mockReturnValue(chain);
    insertMock.mockReturnValue(chain);
    updateMock.mockReturnValue(chain);
    eqMock.mockReturnValue(chain);
    singleMock.mockResolvedValue({ data: row, error: null });
  });

  it("maps the snake_case view number and hydrates relationships", async () => {
    selectMock.mockResolvedValueOnce({
      data: [{ ...row, vinyls: { artist: "The Cure", album: "Disintegration" } }],
      error: null,
    }).mockResolvedValueOnce({ data: [user], error: null });

    const [playlog] = await getPlaylogs();

    expect(fromMock).toHaveBeenCalledWith("ordered_playlogs");
    expect(selectMock).toHaveBeenCalledWith("*, play_number, vinyls(artist, album)");
    expect(playlog).toMatchObject({
      playNumber: 3,
      album_id: 12,
      artist: "The Cure",
      album: "Disintegration",
      date: new Date(row.date),
      listeners: [user],
    });
    expect(playlog).not.toHaveProperty("play_number");
  });

  it("excludes view-only fields from inserts and normalizes returned rows", async () => {
    const playlog = await createPlaylog({
      playNumber: 3,
      artist: "The Cure",
      album: "Disintegration",
      album_id: 12,
      notes: row.notes,
      date: new Date(row.date),
      listeners: [user],
    });

    expect(insertMock).toHaveBeenCalledWith([{
      album_id: 12,
      notes: row.notes,
      date: new Date(row.date),
      listeners: [user.id],
    }]);
    expect(playlog.playNumber).toBe(3);
    expect(playlog.listeners).toEqual([user]);
    expect(playlog.date).toEqual(new Date(row.date));
    expect(playlog).not.toHaveProperty("play_number");
  });

  it("keeps view-only fields out of updates", async () => {
    const playlog = await updatePlaylog(1, {
      playNumber: 3,
      artist: "The Cure",
      album: "Disintegration",
      album_id: null,
      date: new Date(row.date),
      listeners: [],
      notes: "Updated",
    });

    expect(updateMock).toHaveBeenCalledWith({
      album_id: null,
      date: new Date(row.date),
      listeners: [],
      notes: "Updated",
    });
    expect(eqMock).toHaveBeenCalledWith("id", 1);
    expect(playlog.listeners).toEqual([]);
  });

  it("rejects database rows that violate the required date contract", async () => {
    singleMock.mockResolvedValue({ data: { ...row, date: null }, error: null });

    await expect(createPlaylog({
      album_id: 12,
      date: new Date(row.date),
      listeners: [],
    })).rejects.toThrow("Playlog data returned without a date");
  });

  it("propagates database query errors", async () => {
    const error = new Error("View unavailable");
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    selectMock.mockResolvedValueOnce({ data: null, error });

    await expect(getPlaylogs()).rejects.toThrow(error);

    consoleError.mockRestore();
  });
});