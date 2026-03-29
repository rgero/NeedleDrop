import type { PlayLog } from "./PlayLog";

export interface Stats
{
  // This comes from Vinyl Context
  totalOwned: number,
  totalOwnedPerDay: number,
  totalBought: number,
  totalBoughtPerDay: number,
  collectionValue: number,
  pricePaid: number,
  topArtists: Record<string, number>,
  
  // This comes from the Playlog Context
  playlogs: PlayLog[],
  totalPlays: number,
  topPlayDays: Record<string, number>

  playsByDays: Record<string, number>;
  playsByAlbum: Record<string, number>;

  // This comes from LocationContext
  topLocations: Record<string, number>
}