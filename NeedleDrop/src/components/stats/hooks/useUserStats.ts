import { differenceInDays, format, isAfter, startOfYear, subDays } from "date-fns";

import type { Stats } from "@interfaces/Stats";
import { sortByDaysOfWeek } from "@utils/SortByDaysOfWeek";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { useMemo } from "react";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useUserContext } from "@context/users/UserContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const recordsPerDay = (numberOfVinyls: number, cutoffDate: Date | null) => {
  const daysSinceObtained = differenceInDays(new Date(), new Date(cutoffDate ?? import.meta.env.VITE_DATE_STARTED));
  return Math.round( numberOfVinyls / daysSinceObtained * 100) / 100;
}

export const useUserStats = (): Stats => {
  const { vinyls } = useVinylContext();
  const { playlogs } = usePlaylogContext();
  const { user } = useAuthenticationContext();
  const { getCurrentUserSettings } = useUserContext();

  const settings = getCurrentUserSettings();
  const duration = settings?.statsDuration ?? "all";

  return useMemo<Stats>(() => {
    const emptyStats: Stats = {
      playlogs: [],
      totalOwned: 0,
      totalOwnedPerDay: 0,
      totalBought: 0,
      totalBoughtPerDay: 0,
      collectionValue: 0,
      playsByDays: {},
      playsByAlbum: {},
      pricePaid: 0,
      topArtists: {},
      totalPlays: 0,
      topLocations: {},
      topPlayDays: {},
    };

    if (!user) return emptyStats;

    const userId = user.id;
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

    const userVinyls = vinyls.filter((v) => {
      const isOwner = v.owners.some((u) => u.id === userId);
      if (!isOwner) return false;
      if (!cutoffDate) return true;
      return v.purchaseDate && isAfter(new Date(v.purchaseDate), cutoffDate);
    });

    const userPurchased = vinyls.filter((v) => {
      const isPurchaser = v.purchasedBy.some((u) => u.id === userId);
      if (!isPurchaser) return false;
      if (!cutoffDate) return true;
      return v.purchaseDate && isAfter(new Date(v.purchaseDate), cutoffDate);
    });

    const userPlaylogs = playlogs.filter((p) => {
      const isListener = p.listeners.some((u) => u.id === userId);
      if (!isListener) return false;
      if (!cutoffDate) return true;
      return p.date && isAfter(new Date(p.date), cutoffDate);
    });

    const totalOwned = userVinyls.length;
    const totalBought = userPurchased.length;

    const collectionValue = userVinyls.reduce((sum, v) => sum + (v.price ?? 0), 0);
    const pricePaid = userPurchased.reduce((sum, v) => sum + (v.price ?? 0), 0);

    const topArtists = userVinyls.reduce<Record<string, number>>((acc, v) => {
      acc[v.artist] = (acc[v.artist] ?? 0) + 1;
      return acc;
    }, {});

    const totalPlays = userPlaylogs.length;

    const topLocations = userVinyls.reduce<Record<string, number>>((acc, p) => {
      if (!p.purchaseLocation) return acc;
      const loc = p.purchaseLocation.name ?? "";
      acc[loc] = (acc[loc] ?? 0) + 1;
      return acc;
    }, {});

    const topPlayDays = userPlaylogs.reduce<Record<string, number>>((acc, p) => {
      const dateString = p.date ? format(new Date(p.date), "yyyy-MM-dd") : "No Date";
      acc[dateString] = (acc[dateString] ?? 0) + 1;
      return acc;
    }, {});

    const playsByAlbum = userPlaylogs.reduce<Record<string, number>>((acc, p) => {
      const albumString = `${p.artist} - ${p.album}`;
      acc[albumString] = (acc[albumString] ?? 0) + 1;
      return acc;
    }, {});

    const playsByDays = sortByDaysOfWeek(userPlaylogs);

    const totalOwnedPerDay = recordsPerDay(totalOwned, cutoffDate);
    const totalBoughtPerDay = recordsPerDay(totalBought, cutoffDate);

    return {
      totalOwned,
      totalOwnedPerDay,
      totalBoughtPerDay,
      totalBought,
      collectionValue,
      playlogs: userPlaylogs,
      playsByDays,
      playsByAlbum,
      pricePaid,
      topArtists,
      totalPlays,
      topLocations,
      topPlayDays,
    };
  }, [user, vinyls, playlogs, duration]);
};