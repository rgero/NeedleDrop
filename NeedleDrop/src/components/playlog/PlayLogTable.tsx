import { type SortingState, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { Box } from "@mui/material";
import Loading from "@components/ui/Loading";
import { playlogColumns } from "./PlaylogTableHeader";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useState } from "react";

const PlayLogTable = () => {
  const {isLoading, playlogs} = usePlaylogContext();
  const [sorting, setSorting] = useState<SortingState>([]);
  
  const table = useReactTable({
    data: playlogs,
    columns: playlogColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  if (isLoading) return <Loading />;  
  return (
    <Box>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th 
                  key={header.id} 
                  colSpan={header.colSpan}
                  onClick={header.column.getToggleSortingHandler()}
                  style={{ cursor: header.column.getCanSort() ? 'pointer' : 'default' }}
                >
                  {header.isPlaceholder ? null : (
                    <Box justifyItems={"center"}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {{
                        asc: '',
                        desc: '',
                      }[header.column.getIsSorted() as string] ?? null}
                    </Box>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

    </Box>
  );
}

export default PlayLogTable
