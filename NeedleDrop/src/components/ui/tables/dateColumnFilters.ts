import { isValid, parseISO } from "date-fns";

export interface DateParts {
  year: string;
  month: string;
  day: string;
}

export interface DateFilterInput {
  operator: "after" | "before" | "between" | "eq";
  value: DateParts;
  from: DateParts;
  to: DateParts;
}

export const datePartKeys = ["year", "month", "day"] as const;

export const emptyDateParts = (): DateParts => ({ year: "", month: "", day: "" });

export const hasDateParts = (parts: DateParts): boolean =>
  datePartKeys.some((key) => parts[key].trim() !== "");

export const getDatePartsError = (parts: DateParts): string | null => {
  const limits = { year: 9999, month: 12, day: 31 };
  for (const key of datePartKeys) {
    const value = parts[key].trim();
    if (value && (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > limits[key])) {
      return `${key[0].toUpperCase()}${key.slice(1)} must be between 1 and ${limits[key]}.`;
    }
  }

  if (parts.month.trim() && parts.day.trim()) {
    const year = Number(parts.year.trim() || "2000");
    const leapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInMonth = [31, leapYear ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (Number(parts.day) > daysInMonth[Number(parts.month) - 1]) {
      return "Day is not valid for the selected month and year.";
    }
  }

  return null;
};

const selectedKeys = (parts: DateParts) => datePartKeys.filter((key) => parts[key].trim() !== "");

const projectedValue = (parts: DateParts, keys: (keyof DateParts)[]): number =>
  keys.reduce((value, key) => value * 100 + Number(parts[key]), 0);

export const getDateFilterError = (draft: DateFilterInput): string | null => {
  if (draft.operator !== "between") {
    return getDatePartsError(draft.value);
  }

  if (!hasDateParts(draft.from) && !hasDateParts(draft.to)) {
    return null;
  }

  const partsError = getDatePartsError(draft.from) ?? getDatePartsError(draft.to);
  if (partsError) {
    return partsError;
  }

  const keys = selectedKeys(draft.from);
  if (!keys.length || keys.join() !== selectedKeys(draft.to).join()) {
    return "From and To must specify the same date parts.";
  }

  if (keys.includes("year") && projectedValue(draft.from, keys) > projectedValue(draft.to, keys)) {
    return "From must not be after To when a year is specified.";
  }

  return null;
};

export const isDateFilterActive = (draft: DateFilterInput): boolean =>
  getDateFilterError(draft) === null &&
  (draft.operator === "between"
    ? hasDateParts(draft.from) && hasDateParts(draft.to)
    : hasDateParts(draft.value));

export const matchesDateFilter = (rawValue: unknown, draft: DateFilterInput): boolean => {
  if (!isDateFilterActive(draft)) {
    return false;
  }

  let date: Date;
  if (rawValue instanceof Date) {
    date = rawValue;
  } else if (typeof rawValue === "string" && /^\d{4}-\d{2}-\d{2}(?:T|$)/.test(rawValue) && isValid(parseISO(rawValue))) {
    date = new Date(rawValue);
  } else {
    return false;
  }

  if (!isValid(date)) {
    return false;
  }

  const rowParts: DateParts = {
    year: String(date.getUTCFullYear()),
    month: String(date.getUTCMonth() + 1),
    day: String(date.getUTCDate()),
  };
  const boundary = draft.operator === "between" ? draft.from : draft.value;
  const keys = selectedKeys(boundary);
  const rowValue = projectedValue(rowParts, keys);
  const compareValue = projectedValue(boundary, keys);

  if (draft.operator === "between") {
    const endValue = projectedValue(draft.to, keys);
    return compareValue > endValue
      ? rowValue >= compareValue || rowValue <= endValue
      : rowValue >= compareValue && rowValue <= endValue;
  }

  if (draft.operator === "after") {
    return rowValue > compareValue;
  }

  if (draft.operator === "before") {
    return rowValue < compareValue;
  }

  return rowValue === compareValue;
};