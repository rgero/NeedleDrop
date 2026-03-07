import { useState, useMemo } from "react";
import { DataGrid, type GridColumnVisibilityModel, type GridRowParams } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { WantedItemTableColumnDef } from "./WantedTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";
import { DefaultSettings, type WantItemSettings } from "@interfaces/UserSettings";
import { useUserContext } from "@context/users/UserContext";
import Loading from "@components/ui/Loading";

const tableStyles = {
  "& .even": {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  "& .odd": {
    backgroundColor: "transparent",
  },
  "& .MuiDataGrid-row": {
    touchAction: "pan-x pan-y", 
    cursor: "pointer",
  },
};

const WantedItemsTable = () => {
  const { isLoading, wanteditems } = useWantedItemContext();
  const navigate = useNavigate();
  const { isLoading: isSettingsLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext();

  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });

  const initialVisibilityState = useMemo(() =>
    getCurrentUserSettings()?.wantedItems ?? DefaultSettings.wantedItems,
    [getCurrentUserSettings]
  );

  if (isLoading || isSettingsLoading) return <Loading />;

  const processVisibilityChange = (newModel: GridColumnVisibilityModel) => {
    updateCurrentUserSettings({
      wantedItems: newModel as WantItemSettings
    });
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    setTouchStart({ x: e.clientX, y: e.clientY });
  };

  const handleRowClick = (params: GridRowParams, event: React.MouseEvent) => {
    const deltaX = Math.abs(event.clientX - touchStart.x);
    const deltaY = Math.abs(event.clientY - touchStart.y);

    if (deltaX < 10 && deltaY < 10) {
      navigate(`/wantlist/${params.id}`);
    }
  };

  return (
    <Paper sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={wanteditems}
        rowHeight={96}
        columns={WantedItemTableColumnDef}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        autoHeight
        hideFooterPagination
        slotProps={{
          row: {
            onPointerDown: handlePointerDown,
          },
        }}
        onRowClick={handleRowClick}
        onColumnVisibilityModelChange={processVisibilityChange}
        sx={tableStyles}
        initialState={{
          columns: { columnVisibilityModel: initialVisibilityState },
          sorting: {
            sortModel: [{ field: 'artist', sort: 'asc' }],
          },
        }}
      />
    </Paper>
  );
}

export default WantedItemsTable;