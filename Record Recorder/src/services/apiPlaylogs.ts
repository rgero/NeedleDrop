import supabase from "./supabase";

export const getPlaylogs = async () => {
  try{
    const { data: plays, error } = await supabase.from('playlogs').select('*');
    if (error) {
      throw error
    };

    const {data: users} = await supabase.from('users').select('*');
    const userMap = Object.fromEntries((users ?? []).map(u => [u.id, u]));

    return plays.map(p => ({
      ...p,
      date: p.date ? new Date(p.date) : null,
      listeners: p.listeners?.map((id: string) => userMap[id]).filter(Boolean) ?? []
    }));
  } catch (err) {
    console.error(err);
    return [];
  }





}