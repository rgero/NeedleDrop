import type { Stats } from "@interfaces/Stats";
import { format } from "date-fns";
import { sortByDaysOfWeek } from "@utils/SortByDaysOfWeek";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { useMemo } from "react";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

export const useUserStats = (): Stats => {
  const { vinyls } = useVinylContext();
  const { playlogs } = usePlaylogContext();

  const {user} = useAuthenticationContext();

  return useMemo<Stats>(() => {
    if (!user) {
      return {
        totalOwned: 0,
        totalBought: 0,
        collectionValue: 0,
        playsByDays: {},
        pricePaid: 0,
        topArtists: {},
        totalPlays: 0,
        topLocations: {},
        topPlayDays: {},
      };
    } 
    
    const userId = user.id;

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
    const topPlayDays = userPlaylogs.reduce<Record<string, number>>((acc, p) => {
      const dateString = p.date ? format(p.date.toDateString(), "yyyy-MM-dd") : "No Date"
      acc[dateString] = (acc[dateString] ?? 0) + 1;
      return acc;
    }, {});
  
    // Filter locations that appear in user's playlogs
    const topLocations = vinylsOwnedByUser.reduce<Record<string, number>>((acc, p) => {
      if (!p.purchaseLocation) { return acc }
      const loc = p.purchaseLocation.name ?? "";
      acc[loc] = (acc[loc] ?? 0) + 1;
      return acc;
    }, {});
    
    const playsByDays = sortByDaysOfWeek(userPlaylogs);

    return {
      totalOwned,
      totalBought,
      collectionValue,
      playsByDays,
      pricePaid,
      topArtists,
      totalPlays,
      topLocations,
      topPlayDays,
    };
  }, [user, vinyls, playlogs]);
};
