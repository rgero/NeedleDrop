import type { Stats } from "@interfaces/Stats";
import { sortByDaysOfWeek } from "@utils/SortByDaysOfWeek";
import { useMemo } from "react";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useVinylContext } from "@context/vinyl/VinylContext";
import { formatInstantDate } from "@utils/DateTime";
import { useUserContext } from "@context/users/UserContext";

export const useHouseholdStats = () => {
    const { vinyls } = useVinylContext();
    const { playlogs } = usePlaylogContext();
    const { getCurrentUserSettings } = useUserContext();
    const timeZone = getCurrentUserSettings()?.timeZone;
  
    return useMemo<Stats>(() => {
      const totalOwned = vinyls.length;
  
      const vinylsBoughtByUser = vinyls.filter(v =>
        v.purchasedBy && v.purchasedBy.length > 0
      );
      const totalBought = vinylsBoughtByUser.length;
  
      const collectionValue = vinyls.reduce((sum, v) => sum + (v?.price || 0), 0);
      const pricePaid = vinylsBoughtByUser.reduce((sum, v) => sum + (v?.price || 0), 0);
  
      const topArtists = vinyls.reduce<Record<string, number>>((acc, v) => {
        acc[v.artist] = (acc[v.artist] ?? 0) + 1;
        return acc;
      }, {});
  
      const totalPlays = playlogs.length;
      
      const topLocations = vinyls.reduce<Record<string, number>>((acc, p) => {
        if (!p.purchaseLocation) { return acc }
        const loc = p.purchaseLocation.name ?? "";
        acc[loc] = (acc[loc] ?? 0) + 1;
        return acc;
      }, {});

      const topPlayDays = playlogs.reduce<Record<string, number>>((acc, p) => {
        const dateString = p.date ? formatInstantDate(p.date, timeZone) : "No Date"
        acc[dateString] = (acc[dateString] ?? 0) + 1;
        return acc;
      }, {});

      const playsByAlbum = playlogs.reduce<Record<string, number>>((acc, p) => {
        const albumString = p.artist + " - " + p.album;
        acc[albumString] = (acc[albumString] ?? 0) + 1;
        return acc;
      }, {});

      const playsByArtist = playlogs.reduce<Record<string, number>>((acc, p) => {
        const artistString = p.artist || "Unknown Artist";
        acc[artistString] = (acc[artistString] ?? 0) + 1;
        return acc;
      }, {});

      const playsByDays = sortByDaysOfWeek(playlogs, timeZone);

      const playsByMonths = playlogs.reduce<Record<string, number>>((acc, p) => {
        const month = new Intl.DateTimeFormat(undefined, { timeZone, month: "long" }).format(p.date);
        acc[month] = (acc[month] ?? 0) + 1;
        return acc;
      }, {});
    
      return {
        totalOwned,
        totalBought,
        collectionValue,
        playlogs,
        playsByDays,
        playsByMonths,
        playsByAlbum,
        playsByArtist,
        pricePaid,
        topArtists,
        totalPlays,
        topLocations,
        topPlayDays
      };
    }, [vinyls, playlogs, timeZone]);
  };