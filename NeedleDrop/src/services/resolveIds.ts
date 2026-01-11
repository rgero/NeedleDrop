import supabase from "./supabase";

export const resolveIds = async <T extends { id: string | number }>(table: string, ids: (string | number)[]): Promise<Record<string | number, T>> => {
  if (!ids.length) return {};

  const { data, error } = await supabase.from(table).select("*").in("id", ids);

  if (error) {
    console.error(`Failed to fetch ${table}:`, error);
    return {};
  }

  const items = (data as T[]) ?? [];
  return Object.fromEntries(items.map((item) => [item.id, item]));
};