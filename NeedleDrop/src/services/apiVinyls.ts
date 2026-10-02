import type { Vinyl, VinylDbPayload, VinylDbRow } from "@interfaces/Vinyl";
import type { User } from "@interfaces/User";
import type { Location } from "@interfaces/Location";

import { format } from "date-fns";
import { resolveIds } from "./resolveIds";
import supabase from "./supabase";

const hydrateVinylData = async (rawVinyls: VinylDbRow[]): Promise<Vinyl[]> => {
  const userIds = new Set<string>();
  const locationIds = new Set<number>();

  rawVinyls.forEach((v) => {
    const owners = v.owners;
    const purchasedBy = v.purchased_by;
    const likedBy = v.liked_by;
    const location = v.purchase_location;

    owners?.forEach((id: string) => userIds.add(id));
    purchasedBy?.forEach((id: string) => userIds.add(id));
    likedBy?.forEach((id: string) => userIds.add(id));
    if (location) locationIds.add(location);
  });

  const [userMap, locationMap] = await Promise.all([
    resolveIds<User>("users", [...userIds]),
    resolveIds<Location & { id: number }>("locations", [...locationIds]),
  ]);

  return rawVinyls.map((v) => {
    const {
      purchase_number, purchase_date, purchased_by, liked_by,
      purchase_location, double_lp, image_url, play_count, owners, playlogs, ...rest
    } = v;

    return {
      ...rest,
      purchaseNumber: purchase_number,
      playCount: playlogs?.[0]?.count ?? play_count ?? 0,
      doubleLP: double_lp,
      imageUrl: image_url,
      purchaseDate: purchase_date ? new Date(purchase_date + 'T12:00:00') : null,
      owners: owners?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
      purchasedBy: purchased_by?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
      likedBy: liked_by?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
      purchaseLocation: purchase_location ? locationMap[purchase_location] : null,
    };
  });
};

export const getVinyls = async (): Promise<Vinyl[]> => {
  const { data: vinyls, error } = await supabase
    .from("ordered_vinyls")
    .select('*, purchase_number, playlogs(count)')
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    throw error;
  }
  if (!vinyls) {
    throw new Error("No vinyl data returned");
  }

  return hydrateVinylData(vinyls);
};

export const getVinylsByUserId = async (userId: string): Promise<Vinyl[]> => {
  const { data: vinyls, error } = await supabase
    .from("ordered_vinyls")
    .select('*, purchase_number, playlogs(count)')
    .contains("playlogs.listeners", [userId])
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    throw error;
  }
  if (!vinyls) {
    throw new Error("No vinyl data returned");
  }

  return hydrateVinylData(vinyls);
};

export const getUnplayedVinyls = async (userId?: string): Promise<Vinyl[]> => {
  if (!userId) return []; 
  
  const { data: vinyls, error } = await supabase.rpc('get_unplayed_vinyls', { target_user_id: userId });
  
  if (error || !vinyls) {
    console.error(error);
    return [];
  }

  return hydrateVinylData(vinyls);
};

const toVinylDbPayload = (item: Partial<Vinyl>): VinylDbPayload => ({
  ...(item.artist !== undefined && { artist: item.artist }),
  ...(item.album !== undefined && { album: item.album }),
  ...(item.color !== undefined && { color: item.color }),
  ...(item.price !== undefined && { price: item.price }),
  ...(item.length !== undefined && { length: item.length }),
  ...(item.notes !== undefined && { notes: item.notes }),
  ...(item.archived !== undefined && { archived: item.archived }),
  ...(item.doubleLP !== undefined && { double_lp: item.doubleLP }),
  ...(item.imageUrl !== undefined && { image_url: item.imageUrl }),
  ...(item.tags !== undefined && { tags: item.tags.map(tag => tag.trim().toLowerCase()) }),
  ...(item.purchaseDate !== undefined && {
    purchase_date: item.purchaseDate ? format(item.purchaseDate, "yyyy-MM-dd") : null,
  }),
  ...(item.owners !== undefined && { owners: item.owners.map(user => user.id).filter(Boolean) }),
  ...(item.purchasedBy !== undefined && { purchased_by: item.purchasedBy.map(user => user.id).filter(Boolean) }),
  ...(item.likedBy !== undefined && { liked_by: item.likedBy.map(user => user.id).filter(Boolean) }),
  ...(item.purchaseLocation !== undefined && { purchase_location: item.purchaseLocation?.id ?? null }),
});

export const createVinyl = async (newItem: Omit<Vinyl, 'id'>): Promise<void> => {
  const payload = toVinylDbPayload({ ...newItem, tags: newItem.tags ?? [] });

  const { data, error } = await supabase.from("vinyls").insert(payload).select("*").single();
  if (error || !data) {
    console.error("Error creating vinyl:", error);
    throw new Error(error?.message || "Unknown error");
  }
};

export const updateVinyl = async (id: number, updatedItem: Partial<Vinyl>): Promise<void> => {
  const payload = toVinylDbPayload(updatedItem);

  const { error } = await supabase.from("vinyls").update(payload).eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update vinyl");
  }
}

export const deleteVinyl = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("vinyls")
    .update({ archived: true })
    .eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to archive vinyl");
  }
};