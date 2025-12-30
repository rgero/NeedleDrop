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
    v.owner?.forEach((id: string) => userIds.add(id));
    v.likedBy?.forEach((id: string) => userIds.add(id));
    if (v.purchaseLocation) {
      locationIds.add(v.purchaseLocation);
    }
  });

  const [{ data: users }, { data: locations }] = await Promise.all([
    userIds.size ? supabase.from("users").select("*").in("id", [...userIds]) : Promise.resolve({ data: [] }),
    locationIds.size ? supabase.from("locations").select("*").in("id", [...locationIds]) : Promise.resolve({ data: [] })]
  );

  const userMap = Object.fromEntries((users ?? []).map(u => [u.id, u]));
  const locationMap = Object.fromEntries((locations ?? []).map(l => [l.id, l]));

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

    purchaseLocation: locationMap[v.purchaseLocation] ?? null,

    owner: v.owner ?.map((id: string) => {
      return userMap[id]
    }).filter(Boolean) ?? [],

    likedBy: v.likedBy
      ?.map((id: string) => userMap[id])
      .filter(Boolean) ?? []
  }));
};
