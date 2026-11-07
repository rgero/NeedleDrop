import type { PlayLog } from "@interfaces/PlayLog";
import { getInstantDateParts } from "./DateTime";

const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const sortByDaysOfWeek = (playlogs: PlayLog[], timeZone?: string) => {
  return playlogs.reduce((acc, log) => {
    const day = getInstantDateParts(log.date, timeZone).weekday as typeof days[number];
    acc[day]++;
    return acc;
  }, Object.fromEntries(days.map(day => [day, 0])) as Record<typeof days[number], number>);
};