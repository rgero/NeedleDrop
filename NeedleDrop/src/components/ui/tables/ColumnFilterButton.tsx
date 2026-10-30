import { IconButton, Tooltip } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { ColumnDef } from "@tanstack/react-table";
import { useSearchParams } from "react-router-dom";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { getFilterableColumnOptions, isFilterDraftActive, parseColumnFilterDraftMapFromSearchParams } from "./urlColumnFilters";

interface ColumnFilterButtonProps<T> {
  columns: ColumnDef<T, any>[];
}

const ColumnFilterButton = <T,>({ columns }: ColumnFilterButtonProps<T>) => {
  const { openColumnFilterDialog } = useDialogProvider();
  const [searchParams] = useSearchParams();
  const filterDraftMap = parseColumnFilterDraftMapFromSearchParams(searchParams, getFilterableColumnOptions(columns));
  const activeFilterCount = Object.values(filterDraftMap).filter(isFilterDraftActive).length;
  const hasActiveFilters = activeFilterCount > 0;
  const filterStatus = `${activeFilterCount} active ${activeFilterCount === 1 ? "filter" : "filters"}`;

  return (
    <Tooltip title={hasActiveFilters ? `Table filters (${filterStatus})` : "Table filters"}>
      <IconButton
        onClick={() => openColumnFilterDialog({ columns: columns as ColumnDef<unknown, any>[] })}
        color={hasActiveFilters ? "primary" : "default"}
        sx={hasActiveFilters ? {
          bgcolor: "primary.main",
          color: "primary.contrastText",
          "&:hover": { bgcolor: "primary.dark" },
        } : undefined}
        aria-label={hasActiveFilters ? `Configure table filters (${filterStatus})` : "Configure table filters"}
      >
        <SearchIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
};

export default ColumnFilterButton;
