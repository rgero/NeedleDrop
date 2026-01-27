import type { User } from "@interfaces/User";
import type { UserSettings } from "@interfaces/UserSettings";
import supabase from "./supabase";

export const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) console.error(error);
  return data ?? [];
}

export const updateUserSettings = async (userID: string, newSettings: Partial<UserSettings>): Promise<User> => {
  const { data, error } = await supabase.from("users").update({settings: newSettings}).eq("id", userID).select().single();
  if (error) {
    console.error(error);
    throw new Error("Failed to update user settings");
  }
  return data;
}