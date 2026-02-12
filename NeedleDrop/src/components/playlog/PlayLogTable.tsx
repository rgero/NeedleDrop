import { DataGrid, type GridColumnVisibilityModel } from "@mui/x-data-grid";
import { PlayLogTableColumnDef } from "./PlayLogTableColumnDef";
import { useNavigate } from "react-router-dom";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useUserContext } from "@context/users/UserContext";
import { useMemo } from "react";
import { DefaultSettings, type PlaylogsSettings } from "@interfaces/UserSettings";
import Loading from "@components/ui/Loading";

const PlayLogTable = () => {
  const {isLoading, playlogs} = usePlaylogContext();
  const navigate = useNavigate();
  const {isLoading: isSettingsLoading, getCurrentUserSettings, updateCurrentUserSettings} = useUserContext();
  
  const initialVisibilityState = useMemo(() => 
    getCurrentUserSettings()?.playlogs ?? DefaultSettings.playlogs, 
  [getCurrentUserSettings]);

  if (isLoading || isSettingsLoading) return <Loading />;

  const processVisibilityChange = (newModel: GridColumnVisibilityModel) => {
    updateCurrentUserSettings({
      playlogs: newModel as PlaylogsSettings
    });
  };
  
  return (
    <DataGrid
      rows={playlogs}
      columns={PlayLogTableColumnDef}
      onRowClick={(params) => {
        navigate(`/plays/${params.id}`);
      }}
      onColumnVisibilityModelChange={processVisibilityChange}
      autoHeight
      sx={{ border: 0 }}
      initialState={{
        columns: { columnVisibilityModel: initialVisibilityState },
        sorting: {
          sortModel: [{ field: 'playNumber', sort: 'desc' }],
        },
        pagination: {
          paginationModel: { pageSize: 50, page: 0 },
        },
      }}
    />
  );
}

export default PlayLogTable
