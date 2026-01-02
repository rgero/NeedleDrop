import type { Vinyl } from "@interfaces/Vinyl";
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
  const locationIds = new Set<string>();

  vinyls.forEach(v => {
    v.owners?.forEach((id: string) => userIds.add(id));
    v.likedBy?.forEach((id: string) => userIds.add(id));
    if (v.purchaseLocation) {
      locationIds.add(v.purchaseLocation);
    }
  });

  const [{ data: users }] = await Promise.all([
    userIds.size ? supabase.from("users").select("*").in("id", [...userIds]) : Promise.resolve({ data: [] }),
  ]);

  const userMap = Object.fromEntries((users ?? []).map(u => [u.id, u]));
  
  return vinyls.map(v => ({
    id: v.id,
    purchaseNumber: v.purchaseNumber,
    artist: v.artist,
    album: v.album,
    purchaseDate: new Date(v.purchaseDate),
    price: v.price,
    length: v.length,
    notes: v.notes,
    playCount: v.playCount,

    purchaseLocation: v.purchaseLocation ?? null,

    owners: v.owners ?.map((id: string) => {
      return userMap[id]
    }).filter(Boolean) ?? [],

    likedBy: v.likedBy
      ?.map((id: string) => userMap[id])
      .filter(Boolean) ?? []
  }));
};
