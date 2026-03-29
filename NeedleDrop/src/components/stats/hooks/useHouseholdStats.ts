import { differenceInDays, format, isAfter, startOfYear, subDays } from "date-fns";

import type { Stats } from "@interfaces/Stats";
import { sortByDaysOfWeek } from "@utils/SortByDaysOfWeek";
import { useMemo } from "react";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useUserContext } from "@context/users/UserContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const recordsPerDay = (numberOfVinyls: number, cutoffDate: Date | null) => {
  const daysSinceObtained = differenceInDays(new Date(), new Date(cutoffDate ?? import.meta.env.VITE_DATE_STARTED));
  return Math.round( numberOfVinyls / daysSinceObtained * 100) / 100;
}

export const useHouseholdStats = () => {
  const { vinyls } = useVinylContext();
  const { playlogs } = usePlaylogContext();
  const { getCurrentUserSettings } = useUserContext();

  const settings = getCurrentUserSettings();
  const duration = settings?.statsDuration ?? "all";

  return useMemo<Stats>(() => {
    const now = new Date();
    let cutoffDate: Date | null = null;

    switch (duration) {
      case "30":
        cutoffDate = subDays(now, 30);
        break;
      case "60":
        cutoffDate = subDays(now, 60);
        break;
      case "90":
        cutoffDate = subDays(now, 90);
        break;
      case "year":
        cutoffDate = startOfYear(now);
        break;
      case "all":
      default:
        cutoffDate = null;
    }

    const filteredVinyls = cutoffDate ? vinyls.filter((v) => v.purchaseDate && isAfter(new Date(v.purchaseDate), cutoffDate!)) : vinyls;
    const filteredPlaylogs = cutoffDate ? playlogs.filter((p) => p.date && isAfter(new Date(p.date), cutoffDate!)) : playlogs;
    
    const totalOwned = filteredVinyls.length;

    const vinylsBoughtByUser = filteredVinyls.filter( (v) => v.purchasedBy && v.purchasedBy.length > 0);
    const totalBought = vinylsBoughtByUser.length;

    const collectionValue = filteredVinyls.reduce((sum, v) => sum + (v.price ?? 0), 0);
    const pricePaid = vinylsBoughtByUser.reduce((sum, v) => sum + (v.price ?? 0), 0);

    const topArtists = filteredVinyls.reduce<Record<string, number>>((acc, v) => {
      acc[v.artist] = (acc[v.artist] ?? 0) + 1;
      return acc;
    }, {});

    const totalPlays = filteredPlaylogs.length;

    const topLocations = filteredVinyls.reduce<Record<string, number>>((acc, p) => {
      if (!p.purchaseLocation) return acc;
      const loc = p.purchaseLocation.name ?? "";
      acc[loc] = (acc[loc] ?? 0) + 1;
      return acc;
    }, {});

    const topPlayDays = filteredPlaylogs.reduce<Record<string, number>>((acc, p) => {
      const dateString = p.date ? format(new Date(p.date), "yyyy-MM-dd") : "No Date";
      acc[dateString] = (acc[dateString] ?? 0) + 1;
      return acc;
    }, {});

    const playsByAlbum = filteredPlaylogs.reduce<Record<string, number>>((acc, p) => {
      const albumString = `${p.artist} - ${p.album}`;
      acc[albumString] = (acc[albumString] ?? 0) + 1;
      return acc;
    }, {});

    const playsByDays = sortByDaysOfWeek(filteredPlaylogs);


    const totalOwnedPerDay = recordsPerDay(totalOwned, cutoffDate);
    const totalBoughtPerDay = recordsPerDay(totalBought, cutoffDate);

    return {
      totalOwned,
      totalOwnedPerDay,
      totalBought,
      totalBoughtPerDay,
      collectionValue,
      playlogs: filteredPlaylogs,
      playsByDays,
      playsByAlbum,
      pricePaid,
      topArtists,
      totalPlays,
      topLocations,
      topPlayDays,
    };
  }, [vinyls, playlogs, duration]);
};