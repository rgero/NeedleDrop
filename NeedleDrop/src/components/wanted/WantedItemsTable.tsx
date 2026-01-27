import { DataGrid, type GridColumnVisibilityModel } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { WantedItemTableColumnDef } from "./WantedTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";
import { useMemo } from "react";
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
}

const WantedItemsTable = () => {
  const {isLoading, wanteditems} = useWantedItemContext();
  const navigate = useNavigate();
  const {isLoading: isSettingsLoading, getCurrentUserSettings, updateCurrentUserSettings} = useUserContext();
  
  const initialVisibilityState = useMemo(() => 
    getCurrentUserSettings()?.wantedItems ?? DefaultSettings.wantedItems, 
  [getCurrentUserSettings]);

  if (isLoading || isSettingsLoading) return <Loading />;

  const processVisibilityChange = (newModel: GridColumnVisibilityModel) => {
    updateCurrentUserSettings({
      wantedItems: newModel as WantItemSettings
    });
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
        onRowClick={(params) => {
          navigate(`/wantlist/${params.id}`);
        }}
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

export default WantedItemsTable
