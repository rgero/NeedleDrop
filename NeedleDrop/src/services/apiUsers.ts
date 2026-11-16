import type { User } from "@interfaces/User";
import type { UserSettings } from "@interfaces/settings/UserSettings";
import supabase from "./supabase";

export const getUsers = async () => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) {
    console.error(error);
    throw new Error(error.message);
  }
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

export const updateUserProfile = async (
  userID: string,
  settings: UserSettings,
  discordId: string | null,
): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .update({ settings, discord_id: discordId })
    .eq("id", userID)
    .select()
    .single();
  if (error) {
    console.error(error);
    throw new Error("Failed to update user profile");
  }
  return data;
}