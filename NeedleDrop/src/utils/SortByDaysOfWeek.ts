import type { PlayLog } from "@interfaces/PlayLog";
import { getDay } from "date-fns";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const sortByDaysOfWeek = (playlogs: PlayLog[]) => {
  return playlogs.reduce((acc, log) => {
    const day = days[getDay(log.date)];
    acc[day]++;
    return acc;
  }, Object.fromEntries(days.map(day => [day, 0])) as Record<typeof days[number], number>);
};