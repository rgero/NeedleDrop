import type { WantedItem, WantedItemDbPayload, WantedItemDbRow } from "@interfaces/WantedItem";
import type { User } from "@interfaces/User";

import supabase from "./supabase";

const hydrateWantedItem = (row: WantedItemDbRow, searcher: User[]): WantedItem => ({
  id: row.id,
  artist: row.artist,
  album: row.album,
  notes: row.notes,
  length: row.length ?? null,
  imageUrl: row.image_url,
  searcher,
  created_at: new Date(row.created_at),
  weight: row.weight,
});

const toWantedItemDbPayload = (item: Partial<WantedItem>): WantedItemDbPayload => ({
  ...(item.artist !== undefined && { artist: item.artist }),
  ...(item.album !== undefined && { album: item.album }),
  ...(item.notes !== undefined && { notes: item.notes }),
  ...(item.length !== undefined && { length: item.length }),
  ...(item.weight !== undefined && { weight: item.weight }),
  ...(item.imageUrl !== undefined && { image_url: item.imageUrl }),
  ...(item.created_at !== undefined && { created_at: item.created_at.toISOString() }),
  ...(item.searcher !== undefined && {
    searcher: item.searcher.map(user => {
      if (typeof user === 'object' && user !== null && 'id' in user) {
        return user.id;
      }
      return String(user);
    }),
  }),
});

export const getWantedItems = async (): Promise<WantedItem[]> => {
  const { data: wanteditems, error } = await supabase.from("wanted_items").select("*");

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  if (!wanteditems) {
    throw new Error("No wanted items data returned");
  }

  const userIds = new Set<string>();

  wanteditems.forEach(v => {
    v.searcher?.forEach((id: string) => userIds.add(id));
  });

  const [{ data: users }] = await Promise.all([
    userIds.size ? supabase.from("users").select("*").in("id", [...userIds]) : Promise.resolve({ data: [] })]);

  const userMap = Object.fromEntries((users ?? []).map(u => [u.id, u]));

  return wanteditems.map(row => hydrateWantedItem(
    row,
    row.searcher?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
  ));
};

export const updateWantedItem = async (id: number, updatedItem: Partial<WantedItem>): Promise<void> => {
  const payload = toWantedItemDbPayload(updatedItem);

  const { error } = await supabase.from("wanted_items").update(payload).eq("id", id);
  if (error) {
    console.error("Error updating wanted item:", error);
    throw new Error(error.message);
  }
};

export const deleteWantedItem = async (id: number): Promise<void> => {
  const { error } = await supabase.from("wanted_items").delete().eq("id", id);
  if (error) {
    console.error("Error deleting wanted item:", error);
    throw new Error(error.message);
  }
};

export const createWantedItem = async (newItem: Omit<WantedItem, 'id'>): Promise<WantedItem> => {
  const payload = toWantedItemDbPayload(newItem);
  const { data, error } = await supabase.from("wanted_items").insert(payload).select("*").single();

  if (error || !data) {
    console.error("Error creating wanted item:", error);
    throw new Error(error?.message || "Unknown error");
  }
  return hydrateWantedItem(data, newItem.searcher);
}