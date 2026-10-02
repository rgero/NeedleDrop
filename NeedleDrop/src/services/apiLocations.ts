import type { Location } from "@interfaces/Location";
import supabase from "./supabase";

type LocationDbRow = Omit<Location, 'purchaseCount' | 'percentage'> & {
  vinyls?: { count: number }[];
};

export const getLocations = async () => {
  const { data, error } = await supabase
    .from('locations')
    .select('*, vinyls!purchase_location(count)')
    .eq('vinyls.archived', false);

  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
  if (!data) {
    throw new Error("No location data returned");
  }

  const locations = data.map((loc: LocationDbRow) => ({
    ...loc,
    purchaseCount: loc.vinyls?.[0]?.count ?? 0,
  }));

  const totalPurchases = locations.reduce(
    (sum, loc) => sum + loc.purchaseCount,
    0
  );

  return locations.map((loc) => ({
    ...loc,
    percentage:
      totalPurchases > 0 ? (loc.purchaseCount / totalPurchases) * 100 : 0,
  }));
};

export const updateLocation = async (id: number, updatedItem: Partial<Location> & { vinyls?: unknown }): Promise<void> => {
  const locationData = { ...updatedItem };
  delete locationData.purchaseCount;
  delete locationData.vinyls;
  const { error } = await supabase.from("locations").update(locationData).eq("id", id);
  if (error) {
    console.error("Error updating location:", error);
    throw new Error(error.message);
  }
};

export const createLocation = async (newItem: Omit<Location, 'id'>): Promise<Location | null> => {
  const { data, error } = await supabase.from("locations").insert(newItem).select().single();
  if (error) {
    console.error("Error creating location:", error);
    throw new Error(error.message);
  }
  return data;
};

export const deleteLocation = async (id: number): Promise<void> => {
  const { error } = await supabase.from("locations").delete().eq("id", id);
  if (error) {
    console.error("Error deleting location:", error);
    throw new Error(error.message);
  }
};