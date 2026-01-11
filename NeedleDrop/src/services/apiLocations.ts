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