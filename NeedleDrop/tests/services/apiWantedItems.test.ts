import { beforeEach, describe, expect, it, vi } from "vitest";
import { createWantedItem, getWantedItems, updateWantedItem } from "@services/apiWantedItems";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";

const { fromMock, selectMock, insertMock, singleMock, inMock, updateMock, eqMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  selectMock: vi.fn(),
  insertMock: vi.fn(),
  singleMock: vi.fn(),
  inMock: vi.fn(),
  updateMock: vi.fn(),
  eqMock: vi.fn(),
}));

vi.mock("@services/supabase", () => ({
  default: {
    from: fromMock,
  },
}));

describe("apiWantedItems", () => {
  const user = { id: "user-1", name: "Collector", editor: false, settings: DefaultSettings };
  const row = {
    id: 1,
    artist: "Massive Attack",
    album: "Mezzanine",
    searcher: [user.id],
    notes: "Keep sealed",
    length: 42,
    image_url: "cover.jpg",
    weight: "High",
    created_at: "2026-01-01T00:00:00.000Z",
  };

  beforeEach(() => {
    vi.resetAllMocks();
    const chain = { insert: insertMock, select: selectMock, single: singleMock, update: updateMock, eq: eqMock, in: inMock };
    fromMock.mockReturnValue(chain);
    insertMock.mockReturnValue(chain);
    updateMock.mockReturnValue(chain);
    selectMock.mockReturnValue(chain);
    singleMock.mockResolvedValue({ data: row, error: null });
    eqMock.mockResolvedValue({ error: null });
  });

  it("writes snake_case fields and hydrates the created item", async () => {
    const item = await createWantedItem({
      artist: "Massive Attack",
      album: "Mezzanine",
      searcher: [user],
      notes: "Keep sealed",
      length: 42,
      imageUrl: "cover.jpg",
      weight: "High",
      created_at: new Date(row.created_at),
    });

    const { id, ...payload } = row;
    expect(insertMock).toHaveBeenCalledWith(payload);
    expect(item).toEqual({
      id,
      artist: row.artist,
      album: row.album,
      notes: row.notes,
      length: 42,
      imageUrl: "cover.jpg",
      searcher: [user],
      weight: "High",
      created_at: new Date(row.created_at),
    });
  });

  it("hydrates a nullable length from the database", async () => {
    const wantedItemsChain = { select: selectMock };
    const usersChain = { select: selectMock, in: inMock };
    fromMock.mockReturnValueOnce(wantedItemsChain).mockReturnValueOnce(usersChain);
    selectMock
      .mockResolvedValueOnce({
        data: [{
          id: 1,
          artist: "Massive Attack",
          album: "Mezzanine",
          searcher: [],
          notes: null,
          length: null,
          image_url: "cover.jpg",
          created_at: "2026-01-01T00:00:00.000Z",
          weight: "High",
        }],
        error: null,
      })
      .mockResolvedValueOnce({ data: [] });

    const [wantedItem] = await getWantedItems();

    expect(wantedItem.length).toBeNull();
    expect(wantedItem.imageUrl).toBe("cover.jpg");
    expect(wantedItem.created_at).toEqual(new Date(row.created_at));
    expect(wantedItem).not.toHaveProperty("image_url");
  });

  it("hydrates searcher ids from database rows", async () => {
    selectMock.mockResolvedValueOnce({ data: [row], error: null }).mockReturnValueOnce({ in: inMock });
    inMock.mockResolvedValue({ data: [user] });

    const [item] = await getWantedItems();

    expect(item.searcher).toEqual([user]);
    expect(inMock).toHaveBeenCalledWith("id", [user.id]);
  });

  it("maps a partial image update without changing untouched fields", async () => {
    await updateWantedItem(1, { imageUrl: "updated.jpg", id: 99 });

    expect(updateMock).toHaveBeenCalledWith({ image_url: "updated.jpg" });
    expect(eqMock).toHaveBeenCalledWith("id", 1);
  });

  it("preserves explicit nulls and empty searcher arrays", async () => {
    await updateWantedItem(1, { length: null, searcher: [] });

    expect(updateMock).toHaveBeenCalledWith({ length: null, searcher: [] });
  });
});