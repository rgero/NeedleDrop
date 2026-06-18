import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import type { UserSettings } from "@interfaces/settings/UserSettings";
import { useMemo } from "react";
import { useUserContext } from "@context/users/UserContext";
import { Table, TableBody, TableContainer, TableHead, TableRow, TableSortLabel, Paper } from "@mui/material";
import { StyledTableCell } from "./StyledTableCell";
import { StyledTableRow } from "./StyledTableRow";

type TableKeys = Extract<keyof UserSettings, "locations" | "playlogs" | "vinyls" | "wantedItems">;

interface ReactTableProps<T> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<T, any>[];
  data: T[];
  settingsColumn: TableKeys;
  getRowSx?: (row: T) => object;
}

const ReactTable = <T,>({ columns, data, settingsColumn, getRowSx }: ReactTableProps<T>) => {
  const { getCurrentUserSettings } = useUserContext();

  const initialVisibilityState = useMemo(() => {
    const settings = getCurrentUserSettings()?.[settingsColumn];
    return settings ?? DefaultSettings[settingsColumn];
  }, [getCurrentUserSettings, settingsColumn]);

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    enableSortingRemoval: false,
    initialState: {
      columnVisibility: initialVisibilityState,
      sorting: [{ id: "purchaseNumber", desc: false }]
    }
  });

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
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
            <StyledTableRow key={row.id} sx={getRowSx ? getRowSx(row.original) : {}}>
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