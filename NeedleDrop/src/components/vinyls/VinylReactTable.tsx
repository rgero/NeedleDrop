import { flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";

import { DefaultSettings } from "@interfaces/settings/DefaultSettings";
import Loading from "@components/ui/Loading";
import { useMemo } from "react";
import { useUserContext } from "@context/users/UserContext";
import { useVinylContext } from "@context/vinyl/VinylContext";
import vinylColumns from "./VinylReactTableColumns";

const VinylReactTable = () => {
  const { isLoading, vinyls } = useVinylContext();
  const { getCurrentUserSettings } = useUserContext();

  const initialVisibilityState = useMemo(() => {
    const settings = getCurrentUserSettings()?.["vinyls"];
    return settings ?? DefaultSettings["vinyls"];
  }, [getCurrentUserSettings]);
  
  const table = useReactTable({ 
    columns: vinylColumns, 
    data: vinyls,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    
    // Disables the 'none' state; toggles only between ASC and DESC
    enableSortingRemoval: false, 

    initialState: {
      columnVisibility: initialVisibilityState,
      sorting: [
        { id: "purchaseNumber", desc: false },
      ]
    }
  });

  if (isLoading) return <Loading />;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200">
        <thead className="bg-gray-50">
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th 
                  key={header.id}
                  className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b cursor-pointer select-none hover:bg-gray-100"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    
                    <span className="min-w-[14px]">
                      {{
                        asc: ' 🔼',
                        desc: ' 🔽',
                      }[header.column.getIsSorted() as string] ?? null}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map(cell => (
                <td 
                  key={cell.id} 
                  className="px-4 py-2 text-sm text-gray-700 border-b"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default VinylReactTable;