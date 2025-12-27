import supabase from "./supabase";

export const getLocations = async () => {
  const { data, error } = await supabase.from('locations').select('*');
  if (error) console.error(error);
  
  console.log(data);

  return data ?? [];
}