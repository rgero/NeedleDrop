export const getBrowserTimeZone = (): string =>
  Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

export const formatInstantDate = (
  value: Date | string | null | undefined,
  timeZone: string = getBrowserTimeZone(),
): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (!date || isNaN(date.getTime())) return "";

  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
};

export const formatCalendarDate = (
  value: Date | string | null | undefined,
): string => {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  if (typeof value === "string") {
    const dateOnly = /^(\d{4}-\d{2}-\d{2})(?:T|$)/.exec(value)?.[1];
    if (dateOnly) return dateOnly;
  }
  const date = typeof value === "string" ? new Date(`${value}T12:00:00`) : value;
  if (!date || isNaN(date.getTime())) return "";

  if (
    (date.getHours() === 0 && date.getMinutes() === 0)
    || (date.getUTCHours() === 0 && date.getUTCMinutes() === 0)
    || (date.getUTCHours() === 12 && date.getUTCMinutes() === 0)
  ) {
    return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getInstantDateParts = (
  value: Date | string,
  timeZone: string = getBrowserTimeZone(),
) => {
  const date = typeof value === "string" ? new Date(value) : value;
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "long",
    hour: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    weekday: values.weekday ?? "",
    hour: Number(values.hour),
    dateKey: `${values.year}-${String(values.month).padStart(2, "0")}-${String(values.day).padStart(2, "0")}`,
  };
};

export const formatInstantDateTime = (
  value: Date | string,
  timeZone: string = getBrowserTimeZone(),
): string => {
  const date = typeof value === "string" ? new Date(value) : value;
  if (isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat(undefined, {
    timeZone,
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

export const zonedDateTimeToInstant = (
  dateKey: string,
  timeZone: string = getBrowserTimeZone(),
  hour = 0,
  minute = 0,
): Date => {
  const [year, month, day] = dateKey.split("-").map(Number);
  const wallClock = Date.UTC(year, month - 1, day, hour, minute);
  let instant = wallClock;

  for (let iteration = 0; iteration < 3; iteration += 1) {
    const sample = new Date(instant);
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hourCycle: "h23",
    }).formatToParts(sample);
    const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
    const representedWallClock = Date.UTC(
      Number(values.year),
      Number(values.month) - 1,
      Number(values.day),
      Number(values.hour),
      Number(values.minute),
    );
    const adjustment = wallClock - representedWallClock;
    if (adjustment === 0) break;
    instant += adjustment;
  }

  return new Date(instant);
};
