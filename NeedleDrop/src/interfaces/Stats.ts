export interface Stats
{
  // This comes from Vinyl Context
  totalOwned: number,
  totalBought: number,
  collectionValue: number,
  pricePaid: number,
  topArtists: Record<string, number>,
  
  // This comes from the Playlog Context
  totalPlays: number,

  // This comes from LocationContext
  topLocations: Record<string, number>
}