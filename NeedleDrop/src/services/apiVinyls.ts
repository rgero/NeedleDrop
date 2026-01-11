import type { Vinyl, VinylDbPayload } from "@interfaces/Vinyl";

import { format } from "date-fns";
import { resolveIds } from "./resolveIds";
import supabase from "./supabase";

/*
  Note for Future Roy. I'm using Supabase RPC functions for creating and deleting vinyls to handle
  the sequencing of the 'purchaseNumber' field automatically within the database. This ensures that the
  'purchaseNumber' field remains unique and sequential without having to manage it here.
*/

export const getVinyls = async (): Promise<Vinyl[]> => {
  const { data: vinyls, error } = await supabase
    .from("vinyls")
    .select("*");

  if (error || !vinyls) {
    console.error(error);
    return [];
  }

  const userIds = new Set<string>();
  const locationIds = new Set<number>();

  vinyls.forEach((v) => {
    v.owners?.forEach((id: string) => userIds.add(id));
    v.likedBy?.forEach((id: string) => userIds.add(id));
    if (v.purchaseLocation) locationIds.add(v.purchaseLocation);
  });

  const [userMap, locationMap] = await Promise.all([
    resolveIds("users", [...userIds]),
    resolveIds("locations", [...locationIds]),
  ]);

  return vinyls.map((v) => ({
    ...v,
    purchaseDate: v.purchaseDate ? new Date(v.purchaseDate + 'T12:00:00') : null,
    owners: v.owners?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
    likedBy: v.likedBy?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
    purchaseLocation: v.purchaseLocation ? locationMap[v.purchaseLocation] : null,
  }));
};

export const createVinyl = async (newItem: Omit<Vinyl, 'id'>): Promise<void> => {
  const payload = {
    ...newItem,
    purchaseDate: newItem.purchaseDate ? format(newItem.purchaseDate, "yyyy-MM-dd") : null,
    owners: newItem.owners.map((o) => o.id),
    likedBy: newItem.likedBy.map((u) => u.id),
    purchaseLocation: newItem.purchaseLocation?.id || null,
  };

  const { error } = await supabase.rpc('insert_vinyl_with_number', { payload });

  if (error) throw error;
};

export const updateVinyl = async (id: number, updatedItem: Partial<Vinyl>): Promise<void> => {
  const { purchaseDate, owners, likedBy, purchaseLocation, ...rest } = updatedItem;

  const payload: Partial<VinylDbPayload> = { 
    ...rest,
    ...(purchaseDate && { purchaseDate: format(purchaseDate, "yyyy-MM-dd") }),
    ...(owners && { owners: owners.map((u) => u.id).filter(Boolean) }),
    ...(likedBy && { likedBy: likedBy.map((u) => u.id).filter(Boolean) }),
    ...(purchaseLocation !== undefined && { purchaseLocation: purchaseLocation?.id ?? null }),
  };

  const { error } = await supabase.from("vinyls").update(payload).eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update vinyl");
  }
}

export const deleteVinyl = async (id: number): Promise<void> => {
  const { error } = await supabase.rpc('delete_vinyl_and_resequence', { target_id: id });

  if (error) {
    console.error(error);
    throw new Error("Failed to delete and resequence vinyl");
  }
};