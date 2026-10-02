import type { PlayLog, PlaylogDbPayload, PlaylogDbRow } from "@interfaces/PlayLog";
import type { User } from "@interfaces/User";

import supabase from "./supabase";

const hydratePlaylog = (row: PlaylogDbRow, listeners: User[]): PlayLog => {
  if (!row.date) {
    throw new Error("Playlog data returned without a date");
  }
  const { play_number, ...rest } = row;
  return {
    ...rest,
    playNumber: play_number,
    date: new Date(row.date),
    listeners,
  };
};

export const getPlaylogs = async () => {
  const { data: plays, error } = await supabase
    .from('ordered_playlogs')
    .select('*, play_number, vinyls(artist, album)');

  if (error) {
    console.error(error);
    throw error;
  }
  if (!plays) {
    throw new Error("No playlog data returned");
  }

  const { data: users } = await supabase.from('users').select('*');
  const userMap = Object.fromEntries((users ?? []).map(u => [u.id, u]));

  return plays.map(p => ({
    ...hydratePlaylog(p, p.listeners?.map((id: string) => userMap[id]).filter(Boolean) ?? []),
    artist: p.vinyls?.artist || "Unknown Artist",
    album: p.vinyls?.album || "Unknown Album",
  }));
}

export const createPlaylog = async (newItem: Omit<PlayLog, 'id'>) => {
  const payload: PlaylogDbPayload = {
    album_id: newItem.album_id,
    notes: newItem.notes,
    date: newItem.date ?? null,
    listeners: newItem.listeners?.map(user => user.id) ?? [],
  };
  const { data, error } = await supabase.from('playlogs').insert([
    payload
  ]).select().single(); 
  if (error) {
    throw error;
  }
  return hydratePlaylog(data, newItem.listeners);
}

export const updatePlaylog = async (id: number, updatedItem: Partial<PlayLog>) => {
  const cleansedUpdate: Partial<PlaylogDbPayload> = {
    album_id: updatedItem.album_id,
    date: updatedItem.date ?? null,
    listeners: updatedItem.listeners?.map(u => u.id) ?? [],
    notes: updatedItem.notes
  }

  const { data, error } = await supabase.from('playlogs').update(cleansedUpdate).eq('id', id).select().single();

  if (error) {
    throw error;
  }
  
  return hydratePlaylog(data, updatedItem.listeners ?? []);
}

export const deletePlaylog = async (id: number) => {
  const { error } = await supabase.from('playlogs').delete().eq('id', id);
  if (error) {
    throw error;
  }
}