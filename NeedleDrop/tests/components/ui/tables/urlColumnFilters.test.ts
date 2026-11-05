import { describe, expect, it } from "vitest";
import {
  emptyDateParts,
  getDateFilterError,
  getDatePartsError,
  isDateFilterActive,
  matchesDateFilter,
  type DateFilterInput,
  type DateParts,
} from "@components/ui/tables/dateColumnFilters";
import {
  isFilterDraftActive,
  parseColumnFilterDraftMapFromSearchParams,
  toColumnFiltersState,
  writeColumnFilterDraftMapToSearchParams,
  type DateFilterDraft,
} from "@components/ui/tables/urlColumnFilters";

const parts = (values: Partial<DateParts> = {}): DateParts => ({ ...emptyDateParts(), ...values });
const filter = (values: Partial<DateFilterInput> = {}): DateFilterInput => ({
  operator: "eq", value: parts(), from: parts(), to: parts(), ...values,
});

describe("partial date matching", () => {
  it.each([
    { year: "2024" }, { month: "3" }, { day: "15" },
    { year: "2024", month: "3" }, { year: "2024", day: "15" },
    { month: "3", day: "15" }, { year: "2024", month: "3", day: "15" },
  ])("matches supplied components: %j", (value) => {
    expect(matchesDateFilter("2024-03-15T23:59:59Z", filter({ value: parts(value) }))).toBe(true);
  });

  it("matches month/day across years and year-only across months", () => {
    const anniversary = filter({ value: parts({ month: "3", day: "15" }) });
    expect(matchesDateFilter("2020-03-15", anniversary)).toBe(true);
    expect(matchesDateFilter("2024-03-15", anniversary)).toBe(true);
    expect(matchesDateFilter("2024-03-16", anniversary)).toBe(false);
    const year = filter({ value: parts({ year: "2024" }) });
    expect(matchesDateFilter("2024-01-01", year)).toBe(true);
    expect(matchesDateFilter("2024-12-31", year)).toBe(true);
    expect(matchesDateFilter("2023-12-31", year)).toBe(false);
  });

  it("ignores omitted middle components", () => {
    const draft = filter({ value: parts({ year: "2024", day: "15" }) });
    expect(matchesDateFilter("2024-11-15", draft)).toBe(true);
    expect(matchesDateFilter("2024-11-16", draft)).toBe(false);
    expect(matchesDateFilter("2023-11-15", draft)).toBe(false);
  });

  it.each(["after", "before"] as const)("uses strict calendar comparisons for %s", (operator) => {
    const draft = filter({ operator, value: parts({ year: "2024" }) });
    expect(matchesDateFilter("2024-12-31T23:59:59Z", draft)).toBe(false);
    expect(matchesDateFilter(operator === "after" ? "2025-01-01" : "2023-12-31", draft)).toBe(true);
    const full = filter({ operator, value: parts({ year: "2024", month: "3", day: "15" }) });
    expect(matchesDateFilter("2024-03-15T23:59:59Z", full)).toBe(false);
    expect(matchesDateFilter(operator === "after" ? "2024-03-16" : "2024-03-14", full)).toBe(true);
  });

  it("compares recurring month/day and day-only boundaries", () => {
    expect(matchesDateFilter("1990-04-01", filter({ operator: "after", value: parts({ month: "3", day: "15" }) }))).toBe(true);
    expect(matchesDateFilter("2050-02-20", filter({ operator: "before", value: parts({ day: "21" }) }))).toBe(true);
  });

  it("includes the entire end day and interprets timestamps in UTC", () => {
    const draft = filter({ operator: "between", from: parts({ year: "2024", month: "3", day: "15" }), to: parts({ year: "2024", month: "3", day: "16" }) });
    expect(matchesDateFilter("2024-03-16T23:59:59Z", draft)).toBe(true);
    expect(matchesDateFilter(new Date("2024-03-15T00:00:00Z"), draft)).toBe(true);
    expect(matchesDateFilter("2024-03-16T23:00:00-02:00", draft)).toBe(false);
  });

  it("wraps reversed yearless ranges and handles equal bounds", () => {
    const draft = filter({ operator: "between", from: parts({ month: "11" }), to: parts({ month: "2" }) });
    for (const month of [11, 12, 1, 2]) {
      expect(matchesDateFilter(`2024-${String(month).padStart(2, "0")}-15`, draft)).toBe(true);
    }
    expect(matchesDateFilter("2024-06-15", draft)).toBe(false);
    expect(matchesDateFilter("2024-06-15", filter({ ...draft, to: parts({ month: "11" }) }))).toBe(false);
    expect(matchesDateFilter("2024-11-15", filter({ ...draft, to: parts({ month: "11" }) }))).toBe(true);
    const days = filter({ operator: "between", from: parts({ day: "28" }), to: parts({ day: "3" }) });
    expect(matchesDateFilter("2024-01-31", days)).toBe(true);
    expect(matchesDateFilter("2024-02-02", days)).toBe(true);
    expect(matchesDateFilter("2024-02-15", days)).toBe(false);
  });

  it.each([
    { year: "0" }, { year: "10000" }, { month: "13" }, { day: "0" }, { day: "32" },
    { day: "1.5" }, { month: "abc" }, { month: "2", day: "30" },
    { year: "1900", month: "2", day: "29" },
  ])("rejects invalid date parts: %j", (value) => {
    expect(getDatePartsError(parts(value))).not.toBeNull();
    expect(isDateFilterActive(filter({ value: parts(value) }))).toBe(false);
  });

  it("allows leap dates without a year and valid low years", () => {
    expect(getDatePartsError(parts({ month: "2", day: "29" }))).toBeNull();
    expect(getDatePartsError(parts({ year: "2000", month: "2", day: "29" }))).toBeNull();
    expect(matchesDateFilter("0004-02-29", filter({ value: parts({ year: "4", month: "2", day: "29" }) }))).toBe(true);
    expect(matchesDateFilter("2024-02-29", filter({ value: parts({ month: "2", day: "29" }) }))).toBe(true);
  });

  it("rejects incomplete/mismatched/reversed year-bearing ranges", () => {
    for (const draft of [
      filter({ operator: "between", from: parts({ year: "2024" }) }),
      filter({ operator: "between", from: parts({ year: "2024" }), to: parts({ month: "2" }) }),
      filter({ operator: "between", from: parts({ year: "2024" }), to: parts({ year: "2023" }) }),
    ]) {
      expect(getDateFilterError(draft)).not.toBeNull();
      expect(isDateFilterActive(draft)).toBe(false);
    }
    expect(isDateFilterActive(filter())).toBe(false);
    expect(getDateFilterError(filter({ operator: "between" }))).toBeNull();
  });

  it.each([null, undefined, "garbage", "2024-02-30", "2024-13-01", new Date("invalid"), 1700000000000])("rejects invalid row dates: %s", (value) => {
    expect(matchesDateFilter(value, filter({ value: parts({ year: "2024" }) }))).toBe(false);
  });
});

describe("date filter URL persistence", () => {
  const options = [{ id: "date", label: "Date", variant: "date" as const, options: [] }];
  const parse = (query: string) => parseColumnFilterDraftMapFromSearchParams(new URLSearchParams(query), options);

  it.each([
    "f_date_op=eq&f_date_value=2024-03-15",
    "f_date_op=after&f_date_value_year=2024",
    "f_date_op=before&f_date_value_month=3&f_date_value_day=15",
    "f_date_op=between&f_date_from_month=11&f_date_to_month=2",
    "f_date_op=between&f_date_from=2024-03-15&f_date_to=2024-03-16",
  ])("round trips full and partial dates: %s", (query) => {
    const drafts = parse(query);
    const output = writeColumnFilterDraftMapToSearchParams(new URLSearchParams("page=2&f_old=stale"), drafts);
    expect(output.get("page")).toBe("2");
    expect(output.has("f_old")).toBe(false);
    expect(parse(output.toString())).toEqual(drafts);
    expect(isFilterDraftActive(drafts.date)).toBe(true);
    expect(toColumnFiltersState(drafts)).toHaveLength(1);
  });

  it.each(["year", "month", "day"] as const)("persists a single %s without filling other parts", (key) => {
    const drafts = { date: { ...filter({ value: parts({ [key]: "12" }) }), variant: "date" as const } };
    const output = writeColumnFilterDraftMapToSearchParams(new URLSearchParams(), drafts);
    expect(output.get(`f_date_value_${key}`)).toBe("12");
    expect(output.has("f_date_value")).toBe(false);
    expect(parse(output.toString())).toEqual(drafts);
  });

  it("keeps full dates in the existing URL format, including low years", () => {
    const draft: DateFilterDraft = { variant: "date", ...filter({ value: parts({ year: "4", month: "2", day: "29" }) }) };
    const output = writeColumnFilterDraftMapToSearchParams(new URLSearchParams(), { date: draft });
    expect(output.get("f_date_value")).toBe("0004-02-29");
    expect(matchesDateFilter("0004-02-29", parse(output.toString()).date as DateFilterDraft)).toBe(true);
  });

  it("gives explicit components precedence over legacy values", () => {
    const draft = parse("f_date_value=2024-03-15&f_date_value_month=11").date as DateFilterDraft;
    expect(draft.value).toEqual(parts({ month: "11" }));
  });

  it("normalizes extra leading zeros in full-date URL values", () => {
    const draft: DateFilterDraft = { variant: "date", ...filter({ value: parts({ year: "0002024", month: "003", day: "015" }) }) };
    const output = writeColumnFilterDraftMapToSearchParams(new URLSearchParams(), { date: draft });
    expect(output.get("f_date_value")).toBe("2024-03-15");
    expect(isFilterDraftActive(parse(output.toString()).date)).toBe(true);
  });

  it.each([
    "", "f_date_value=invalid", "f_date_value=2024-02-30",
    "f_date_value=2024-03-15&f_date_value_year=garbage",
    "f_date_value_month=13", "f_date_op=between&f_date_from_year=2024",
    "f_date_op=between&f_date_from_year=2024&f_date_to_month=3",
  ])("does not activate or serialize invalid/empty dates: %s", (query) => {
    const drafts = parse(query);
    expect(isFilterDraftActive(drafts.date)).toBe(false);
    expect(toColumnFiltersState(drafts)).toEqual([]);
    expect(writeColumnFilterDraftMapToSearchParams(new URLSearchParams(query), drafts).toString()).toBe("");
  });

  it("ignores hidden single-date values in ranges and hidden ranges in single conditions", () => {
    const range = parse("f_date_op=between&f_date_value_year=invalid&f_date_from_month=11&f_date_to_month=2");
    expect(isFilterDraftActive(range.date)).toBe(true);
    const single = parse("f_date_value_year=2024&f_date_from_year=invalid");
    expect(isFilterDraftActive(single.date)).toBe(true);
    const output = writeColumnFilterDraftMapToSearchParams(new URLSearchParams(), single);
    expect(output.has("f_date_from_year")).toBe(false);
  });
});