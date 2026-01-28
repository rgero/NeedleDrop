import type { UserStats } from "@interfaces/UserStats";
import { useMemo } from "react";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

export const useUserStats = (userId: string): UserStats => {
  const { vinyls } = useVinylContext();
  const { playlogs } = usePlaylogContext();

  return useMemo<UserStats>(() => {
    if (!userId) {
      return {
        totalOwned: 0,
        totalBought: 0,
        collectionValue: 0,
        pricePaid: 0,
        topArtists: {},
        totalPlays: 0,
        topLocations: {},
      };
    }   

    // Filter vinyls by userId
    const vinylsOwnedByUser = vinyls.filter(v =>
      v.owners.some(u => u.id === userId)
    );  
    const totalOwned = vinylsOwnedByUser.length;

    const vinylsBoughtByUser = vinyls.filter(v =>
      v.purchasedBy.some(u => u.id === userId)
    );
    const totalBought = vinylsBoughtByUser.length;

    const collectionValue = vinylsOwnedByUser.reduce((sum, v) => sum + (v.price ?? 0), 0);
    const pricePaid = vinylsBoughtByUser.reduce((sum, v) => sum + (v.price ?? 0), 0);

    const topArtists = vinylsOwnedByUser.reduce<Record<string, number>>((acc, v) => {
      acc[v.artist] = (acc[v.artist] ?? 0) + 1;
      return acc;
    }, {});

    // Filter playlogs by userId
    const userPlaylogs = playlogs.filter(p =>
      p.listeners.some(u => u.id === userId)
    );
    const totalPlays = userPlaylogs.length;

    // Filter locations that appear in user's playlogs
    const topLocations = vinylsBoughtByUser.reduce<Record<string, number>>((acc, p) => {
      if (!p.purchaseLocation) { return acc }
      const loc = p.purchaseLocation.name ?? "";
      acc[loc] = (acc[loc] ?? 0) + 1;
      return acc;
    }, {});

    return {
      totalOwned,
      totalBought,
      collectionValue,
      pricePaid,
      topArtists,
      totalPlays,
      topLocations,
    };
  }, [userId, vinyls, playlogs]);
};
