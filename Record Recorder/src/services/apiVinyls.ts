import type { Vinyl, VinylDbPayload } from "@interfaces/Vinyl";

import { resolveIds } from "./resolveIds";
import supabase from "./supabase";

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

  // Resolve all IDs
  const [userMap, locationMap] = await Promise.all([
    resolveIds("users", [...userIds]),
    resolveIds("locations", [...locationIds]),
  ]);

  return vinyls.map((v) => ({
    ...v,
    purchaseDate: new Date(v.purchaseDate),
    owners: v.owners?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
    likedBy: v.likedBy?.map((id: string) => userMap[id]).filter(Boolean) ?? [],
    purchaseLocation: v.purchaseLocation ? locationMap[v.purchaseLocation] : null,
  }));
};

export const createVinyl = async (newItem: Omit<Vinyl, 'id'>): Promise<Vinyl> => {

  // I still need to set the purchaseNumber.
  
  const payload: VinylDbPayload = {
    ...newItem,
    owners: newItem.owners.map((owner) => owner.id!.toString()),
    likedBy: newItem.likedBy.map((user) => user.id!.toString()),
    purchaseLocation: newItem.purchaseLocation ? newItem.purchaseLocation.id! : null,
  };

  const { data: vinyl, error } = await supabase
    .from("vinyls")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error(error);
    throw new Error("Failed to create vinyl");
  }

  return vinyl as Vinyl;
}

export const updateVinyl = async (id: number, updatedItem: Partial<Vinyl>) => {
  const payload: Partial<VinylDbPayload> = { 
    ...updatedItem,
    owners: updatedItem.owners?.map((u) => u.id).filter(Boolean) ?? undefined,
    likedBy: updatedItem.likedBy?.map((u) => u.id).filter(Boolean) ?? undefined,
    purchaseLocation: updatedItem.purchaseLocation?.id ?? undefined,
  };
  
  const { data, error } = await supabase.from("vinyls").update(payload).eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("Failed to update vinyl");
  }

  return data;
}

export const deleteVinyl = async (id: number): Promise<void> => {
  const { error } = await supabase
    .from("vinyls")
    .delete()
    .eq("id", id);
  if (error) {
    console.error(error);
    throw new Error("Failed to delete vinyl");
  }
} 