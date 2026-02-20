import type { Stats } from "@interfaces/Stats";
import { format } from "date-fns";
import { sortByDaysOfWeek } from "@utils/SortByDaysOfWeek";
import { useMemo } from "react";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

export const useHouseholdStats = () => {
    const { vinyls } = useVinylContext();
    const { playlogs } = usePlaylogContext();
  
    return useMemo<Stats>(() => {
      const totalOwned = vinyls.length;
  
      const vinylsBoughtByUser = vinyls.filter(v =>
        v.purchasedBy && v.purchasedBy.length > 0
      );
      const totalBought = vinylsBoughtByUser.length;
  
      const collectionValue = vinyls.reduce((sum, v) => sum + (v.price ?? 0), 0);
      const pricePaid = vinylsBoughtByUser.reduce((sum, v) => sum + (v.price ?? 0), 0);
  
      const topArtists = vinyls.reduce<Record<string, number>>((acc, v) => {
        acc[v.artist] = (acc[v.artist] ?? 0) + 1;
        return acc;
      }, {});
  
      const totalPlays = playlogs.length;
  
      // Filter locations that appear in user's vinyls
      const topLocations = vinyls.reduce<Record<string, number>>((acc, p) => {
        if (!p.purchaseLocation) { return acc }
        const loc = p.purchaseLocation.name ?? "";
        acc[loc] = (acc[loc] ?? 0) + 1;
        return acc;
      }, {});

      const topPlayDays = playlogs.reduce<Record<string, number>>((acc, p) => {
        const dateString = p.date ? format(p.date.toDateString(), "yyyy-MM-dd") : "No Date"
        acc[dateString] = (acc[dateString] ?? 0) + 1;
        return acc;
      }, {});

      const playsByAlbum = playlogs.reduce<Record<string, number>>((acc, p) => {
        const albumString = p.artist + " - " + p.album;
        acc[albumString] = (acc[albumString] ?? 0) + 1;
        return acc;
      }, {});

      const playsByDays = sortByDaysOfWeek(playlogs);
    
      return {
        totalOwned,
        totalBought,
        collectionValue,
        playlogs,
        playsByDays,
        playsByAlbum,
        pricePaid,
        topArtists,
        totalPlays,
        topLocations,
        topPlayDays
      };
    }, [vinyls, playlogs]);
  };