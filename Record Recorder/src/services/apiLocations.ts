import type { Location } from "@interfaces/Location";
import supabase from "./supabase";

export const getLocations = async () => {
  const { data, error } = await supabase.from('locations').select('*');
  if (error) console.error(error);
  return data ?? [];
}

export const updateLocation = async (id: number, updatedItem: Partial<Location>): Promise<void> => {
  const { error } = await supabase.from("locations").update(updatedItem).eq("id", id);
  if (error) {
    console.error("Error updating location:", error);
    throw new Error(error.message);
  }
};