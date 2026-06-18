import {flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef, type OnChangeFn, type SortingState, type VisibilityState} from "@tanstack/react-table";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import type { UserSettings } from "@interfaces/settings/UserSettings";
import { useEffect, useMemo, useState } from "react";
import { useUserContext } from "@context/users/UserContext";
import { Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from "@mui/material";
import { StyledTableCell } from "./StyledTableCell";
import { StyledTableRow } from "./StyledTableRow";
import { useNavigate } from "react-router-dom";

type TableKeys = Extract<keyof UserSettings, "locations" | "playlogs" | "vinyls" | "wantedItems">;

const tableDetailRouteByKey: Record<TableKeys, string> = {
  locations: "/locations",
  playlogs: "/plays",
  vinyls: "/vinyls",
  wantedItems: "/wantlist",
};

interface ReactTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data: T[];
  settingsColumn: TableKeys;
  getRowSx?: (row: T) => object;
}

const ReactTable = <T,>({ columns, data, settingsColumn, getRowSx }: ReactTableProps<T>) => {
  const navigate = useNavigate();
  const { getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  const settingsVisibility = useMemo(() => {
    const settings = getCurrentUserSettings()?.[settingsColumn];
    return settings ?? DefaultSettings[settingsColumn];
  }, [getCurrentUserSettings, settingsColumn]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    settingsVisibility as VisibilityState,
  );

  const settingsSorting = useMemo<SortingState>(() => {
    const sortModels = getCurrentUserSettings()?.sortModels?.[settingsColumn]
      ?? DefaultSettings.sortModels?.[settingsColumn]
      ?? [];

    return sortModels.map((sortModel) => ({
      id: sortModel.field,
      desc: sortModel.sort === "desc",
    }));
  }, [getCurrentUserSettings, settingsColumn]);

  const [sorting, setSorting] = useState<SortingState>(settingsSorting);

  useEffect(() => {
    setColumnVisibility(settingsVisibility as VisibilityState);
  }, [settingsVisibility]);

  useEffect(() => {
    setSorting(settingsSorting);
  }, [settingsSorting]);

  const handleColumnVisibilityChange: OnChangeFn<VisibilityState> = (updater) => {
    setColumnVisibility((previousState) => {
      const nextState = typeof updater === "function" ? updater(previousState) : updater;

      updateCurrentUserSettings({
        [settingsColumn]: nextState as UserSettings[TableKeys],
      });

      return nextState;
    });
  };

  const handleSortingChange: OnChangeFn<SortingState> = (updater) => {
    setSorting((previousState) => {
      const nextState = typeof updater === "function" ? updater(previousState) : updater;
      const currentSortModels = getCurrentUserSettings()?.sortModels ?? DefaultSettings.sortModels;

      updateCurrentUserSettings({
        sortModels: {
          ...currentSortModels,
          [settingsColumn]: nextState.map((sortModel) => ({
            field: String(sortModel.id),
            sort: sortModel.desc ? "desc" : "asc",
          })),
        },
      });

      return nextState;
    });
  };

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    state: {
      columnVisibility,
      sorting,
    },
    onColumnVisibilityChange: handleColumnVisibilityChange,
    onSortingChange: handleSortingChange,
  });

  const handleRowClick = (row: T) => {
    const rowWithId = row as T & { id?: string | number };
    if (rowWithId.id === undefined || rowWithId.id === null) {
      return;
    }

    navigate(`${tableDetailRouteByKey[settingsColumn]}/${rowWithId.id}`);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700, width: "100%", tableLayout: "fixed" }} aria-label="customized table">
        <TableHead>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => {
                const isSorted = header.column.getIsSorted();
                return (
                  <StyledTableCell
                    key={header.id}
                    sortDirection={isSorted}
                  >
                    <TableSortLabel
                      active={!!isSorted}
                      direction={isSorted || 'asc'}
                      onClick={header.column.getToggleSortingHandler()}
                      // Setting the color via sx to ensure visibility on black background
                      sx={{
                        color: 'inherit !important',
                        whiteSpace: 'nowrap',
                        '& .MuiTableSortLabel-icon': {
                          color: 'inherit !important',
                        },
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableSortLabel>
                  </StyledTableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <StyledTableRow
              key={row.id}
              sx={{
                ...(getRowSx ? getRowSx(row.original) : {}),
                cursor: "pointer",
              }}
              onClick={() => handleRowClick(row.original)}
            >
              {row.getVisibleCells().map(cell => (
                <StyledTableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ReactTable;