import { useState, useMemo } from "react";
import { DataGrid, type GridColDef, type GridColumnVisibilityModel, type GridRowClassNameParams, type GridRowParams, type GridSortModel } from "@mui/x-data-grid";
import { Paper, type SxProps, type Theme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { DefaultSettings, type SortModel, type UserSettings } from "@interfaces/UserSettings";
import { useUserContext } from "@context/users/UserContext";
import Loading from "@components/ui/Loading";

type TableKeys = Extract<keyof UserSettings, "locations" | "playlogs" | "vinyls" | "wantedItems">;

interface DataTablePresentationProps {
  items: object[];
  columns: GridColDef[];
  slug: string;
  settingsColumn: TableKeys;
  rowHeight?: number;
  customTableStyle?: SxProps<Theme>;
  customRowClass?: (params: GridRowClassNameParams) => string;
}

const defaultTableStyle: SxProps<Theme> = {
  border: 0,
  "& .even": {
    backgroundColor: "rgba(0, 0, 0, 0.25)",
  },
  "& .odd": {
    backgroundColor: "transparent",
  },
};

const DataTablePresentation = ({items, columns, slug, settingsColumn, rowHeight, customTableStyle, customRowClass}: DataTablePresentationProps) => {
  const navigate = useNavigate();
  const { isLoading: isSettingsLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const initialVisibilityState = useMemo(() => {
    const settings = getCurrentUserSettings()?.[settingsColumn];
    return settings ?? DefaultSettings[settingsColumn];
  }, [getCurrentUserSettings, settingsColumn]);

  const initialSortModel = useMemo(() => {
    const settings = getCurrentUserSettings()?.sortModels?.[settingsColumn];
    return settings ?? DefaultSettings.sortModels?.[settingsColumn] ?? [];
  }, [getCurrentUserSettings, settingsColumn]);

  if (isSettingsLoading) return <Loading />;

  const processVisibilityChange = (newModel: GridColumnVisibilityModel) => {
    updateCurrentUserSettings({
      [settingsColumn]: newModel
    });
  };

const processSortModelChange = (newModel: GridSortModel) => {
  const currentSettings = getCurrentUserSettings();
  const currentSortModels = currentSettings?.sortModels || DefaultSettings.sortModels || {};

  updateCurrentUserSettings({
    sortModels: {
      ...currentSortModels,
      [settingsColumn]: newModel as SortModel[], 
    },
  });
};

  const handlePointerDown = (e: React.PointerEvent) => {
    setTouchStart({ x: e.clientX, y: e.clientY });
  };

  const handleRowClick = (params: GridRowParams, event: React.MouseEvent) => {
    const deltaX = Math.abs(event.clientX - touchStart.x);
    const deltaY = Math.abs(event.clientY - touchStart.y);

    if (deltaX < 10 && deltaY < 10) {
      navigate(`/${slug}/${params.id}`);
    }
  };

  const getCombinedRowClass = (params: GridRowClassNameParams) => {
    const internalClass = params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd";
    const externalClass = customRowClass ? customRowClass(params) : "";
    return `${internalClass} ${externalClass}`.trim();
  };

  return (
    <Paper sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={items}
        rowHeight={rowHeight}
        columns={columns}
        getRowClassName={getCombinedRowClass}
        autoHeight
        sortingOrder={['asc', 'desc']}
        slotProps={{
          row: {
            onPointerDown: handlePointerDown,
          },
        }}
        onRowClick={handleRowClick}
        onColumnVisibilityModelChange={processVisibilityChange}
        onSortModelChange={processSortModelChange}
        sx={{ ...defaultTableStyle, ...customTableStyle }}
        initialState={{
          columns: { columnVisibilityModel: initialVisibilityState },
          sorting: {
            sortModel: initialSortModel,
          },
          pagination: {
            paginationModel: { pageSize: 50, page: 0 },
          },
        }}
      />
    </Paper>
  );
}

export default DataTablePresentation;