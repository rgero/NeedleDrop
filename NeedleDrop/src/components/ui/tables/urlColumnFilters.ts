import type { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { datePartKeys, emptyDateParts, isDateFilterActive, type DateFilterInput, type DateParts } from "./dateColumnFilters";

export const FILTER_QUERY_PREFIX = "f_";

type TableColumnDef<T> = ColumnDef<T, unknown>;

export type FilterVariant = "text" | "number" | "date" | "boolean" | "select";
export type NumberFilterOperator = "gt" | "lt" | "eq";
export type DateFilterOperator = DateFilterInput["operator"];
export type TextFilterOperator = "includes" | "excludes";
export type BooleanFilterValue = "" | "true" | "false";

export interface TextFilterDraft {
  variant: "text";
  operator: TextFilterOperator;
  value: string;
}

export interface NumberFilterDraft {
  variant: "number";
  operator: NumberFilterOperator;
  value: string;
}

export interface DateFilterDraft extends DateFilterInput {
  variant: "date";
}

export interface BooleanFilterDraft {
  variant: "boolean";
  value: BooleanFilterValue;
}

export interface SelectFilterDraft {
  variant: "select";
  value: string;
}

export type ColumnFilterDraft =
  | TextFilterDraft
  | NumberFilterDraft
  | DateFilterDraft
  | BooleanFilterDraft
  | SelectFilterDraft;

export type ColumnFilterDraftMap = Record<string, ColumnFilterDraft>;

interface ColumnFilterMeta {
  filterVariant?: FilterVariant;
  filterOptions?: string[];
}

export interface FilterableColumnOption {
  id: string;
  label: string;
  variant: FilterVariant;
  options: string[];
}

const prettifyColumnId = (value: string) => {
  return value
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase())
    .trim();
};

export const getColumnId = <T,>(columnDef: TableColumnDef<T>): string | null => {
  if (typeof columnDef.id === "string") {
    return columnDef.id;
  }

  if ("accessorKey" in columnDef && typeof columnDef.accessorKey === "string") {
    return columnDef.accessorKey;
  }

  return null;
};

export const getFilterableColumnOptions = <T,>(columns: TableColumnDef<T>[]): FilterableColumnOption[] => {
  return columns
    .map((columnDef) => {
      const id = getColumnId(columnDef);
      if (!id) {
        return null;
      }

      const label = typeof columnDef.header === "string" ? columnDef.header : prettifyColumnId(id);
      const meta = (columnDef.meta ?? {}) as ColumnFilterMeta;
      const variant = meta.filterVariant ?? "text";
      const options = Array.isArray(meta.filterOptions) ? meta.filterOptions : [];

      return { id, label, variant, options };
    })
    .filter((option): option is FilterableColumnOption => Boolean(option));
};

const isNumberOperator = (operator: string | null): operator is NumberFilterOperator => {
  return operator === "gt" || operator === "lt" || operator === "eq";
};

const isDateOperator = (operator: string | null): operator is DateFilterOperator => {
  return operator === "after" || operator === "before" || operator === "between" || operator === "eq";
};

const isTextOperator = (operator: string | null): operator is TextFilterOperator => {
  return operator === "includes" || operator === "excludes";
};

const readDateParts = (searchParams: URLSearchParams, key: string): DateParts => {
  if (datePartKeys.some((part) => searchParams.has(`${key}_${part}`))) {
    return {
      year: searchParams.get(`${key}_year`) ?? "",
      month: searchParams.get(`${key}_month`) ?? "",
      day: searchParams.get(`${key}_day`) ?? "",
    };
  }

  const legacyValue = searchParams.get(key) ?? "";
  if (!legacyValue) {
    return emptyDateParts();
  }

  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(legacyValue);
  return match
    ? { year: match[1], month: match[2], day: match[3] }
    : { ...emptyDateParts(), year: `Invalid date: ${legacyValue}` };
};

const writeDateParts = (searchParams: URLSearchParams, key: string, parts: DateParts) => {
  if (datePartKeys.every((part) => parts[part].trim() !== "")) {
    searchParams.set(key, datePartKeys.map((part) => String(Number(parts[part])).padStart(part === "year" ? 4 : 2, "0")).join("-"));
    return;
  }

  datePartKeys.forEach((part) => {
    if (parts[part].trim()) {
      searchParams.set(`${key}_${part}`, parts[part].trim());
    }
  });
};

const buildFilterDraft = (
  searchParams: URLSearchParams,
  option: FilterableColumnOption,
): ColumnFilterDraft => {
  if (option.variant === "boolean") {
    const valueParam = searchParams.get(`${FILTER_QUERY_PREFIX}${option.id}`);
    const value: BooleanFilterValue = valueParam === "true" || valueParam === "false" ? valueParam : "";

    return {
      variant: "boolean",
      value,
    };
  }

  if (option.variant === "select") {
    return {
      variant: "select",
      value: searchParams.get(`${FILTER_QUERY_PREFIX}${option.id}`) ?? "",
    };
  }

  if (option.variant === "number") {
    const operatorParam = searchParams.get(`${FILTER_QUERY_PREFIX}${option.id}_op`);
    const valueParam = searchParams.get(`${FILTER_QUERY_PREFIX}${option.id}_value`) ?? "";

    return {
      variant: "number",
      operator: isNumberOperator(operatorParam) ? operatorParam : "eq",
      value: valueParam,
    };
  }

  if (option.variant === "date") {
    const operatorParam = searchParams.get(`${FILTER_QUERY_PREFIX}${option.id}_op`);

    return {
      variant: "date",
      operator: isDateOperator(operatorParam) ? operatorParam : "eq",
      value: readDateParts(searchParams, `${FILTER_QUERY_PREFIX}${option.id}_value`),
      from: readDateParts(searchParams, `${FILTER_QUERY_PREFIX}${option.id}_from`),
      to: readDateParts(searchParams, `${FILTER_QUERY_PREFIX}${option.id}_to`),
    };
  }

  const operatorParam = searchParams.get(`${FILTER_QUERY_PREFIX}${option.id}_op`);
  const valueParam = searchParams.get(`${FILTER_QUERY_PREFIX}${option.id}`) ?? "";

  return {
    variant: "text",
    operator: isTextOperator(operatorParam) ? operatorParam : "includes",
    value: valueParam,
  };
};

export const parseColumnFilterDraftMapFromSearchParams = (
  searchParams: URLSearchParams,
  options: FilterableColumnOption[],
): ColumnFilterDraftMap => {
  return options.reduce<ColumnFilterDraftMap>((accumulator, option) => {
    accumulator[option.id] = buildFilterDraft(searchParams, option);
    return accumulator;
  }, {});
};

export const isFilterDraftActive = (draft: ColumnFilterDraft): boolean => {
  if (draft.variant === "boolean") {
    return draft.value === "true" || draft.value === "false";
  }

  if (draft.variant === "select") {
    return draft.value.trim().length > 0;
  }

  if (draft.variant === "text") {
    return draft.value.trim().length > 0;
  }

  if (draft.variant === "number") {
    return draft.value.trim().length > 0;
  }

  return isDateFilterActive(draft);
};

export const toColumnFiltersState = (draftMap: ColumnFilterDraftMap): ColumnFiltersState => {
  return Object.entries(draftMap).reduce<ColumnFiltersState>((accumulator, [columnId, draft]) => {
    if (!isFilterDraftActive(draft)) {
      return accumulator;
    }

    accumulator.push({
      id: columnId,
      value: draft,
    });

    return accumulator;
  }, []);
};

export const writeColumnFilterDraftMapToSearchParams = (
  baseSearchParams: URLSearchParams,
  nextFilterDraftMap: ColumnFilterDraftMap,
): URLSearchParams => {
  const nextParams = new URLSearchParams(baseSearchParams);

  const keysToDelete: string[] = [];
  nextParams.forEach((_, key) => {
    if (key.startsWith(FILTER_QUERY_PREFIX)) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => nextParams.delete(key));

  Object.entries(nextFilterDraftMap).forEach(([columnId, draft]) => {
    if (!isFilterDraftActive(draft)) {
      return;
    }

    if (draft.variant === "boolean") {
      nextParams.set(`${FILTER_QUERY_PREFIX}${columnId}`, draft.value);
      return;
    }

    if (draft.variant === "select") {
      nextParams.set(`${FILTER_QUERY_PREFIX}${columnId}`, draft.value.trim());
      return;
    }

    if (draft.variant === "text") {
      nextParams.set(`${FILTER_QUERY_PREFIX}${columnId}_op`, draft.operator);
      nextParams.set(`${FILTER_QUERY_PREFIX}${columnId}`, draft.value.trim());
      return;
    }

    if (draft.variant === "number") {
      nextParams.set(`${FILTER_QUERY_PREFIX}${columnId}_op`, draft.operator);
      nextParams.set(`${FILTER_QUERY_PREFIX}${columnId}_value`, draft.value.trim());
      return;
    }

    nextParams.set(`${FILTER_QUERY_PREFIX}${columnId}_op`, draft.operator);

    if (draft.operator === "between") {
      writeDateParts(nextParams, `${FILTER_QUERY_PREFIX}${columnId}_from`, draft.from);
      writeDateParts(nextParams, `${FILTER_QUERY_PREFIX}${columnId}_to`, draft.to);
      return;
    }

    writeDateParts(nextParams, `${FILTER_QUERY_PREFIX}${columnId}_value`, draft.value);
  });

  return nextParams;
};
