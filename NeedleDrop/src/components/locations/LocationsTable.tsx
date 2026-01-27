import { DataGrid, type GridColumnVisibilityModel } from "@mui/x-data-grid";
import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import { useLocationContext } from "@context/location/LocationContext";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "@context/users/UserContext";
import { DefaultSettings, type LocationSettings } from "@interfaces/UserSettings";
import { useMemo } from "react";
import Loading from "@components/ui/Loading";

const LocationsTable = () => {
  const {isLoading, locations} = useLocationContext();
  const navigate = useNavigate();
  const {isLoading: isSettingsLoading, getCurrentUserSettings, updateCurrentUserSettings} = useUserContext();
  
  const initialVisibilityState = useMemo(() => 
    getCurrentUserSettings()?.locations ?? DefaultSettings.locations, 
  [getCurrentUserSettings]);

  if (isLoading || isSettingsLoading) return <Loading />;

  const processVisibilityChange = (newModel: GridColumnVisibilityModel) => {
    updateCurrentUserSettings({
      locations: newModel as LocationSettings
    });
  };
  
  return (
    <DataGrid
      rows={locations}
      columns={LocationTableColumnDef}
      onRowClick={(params) => {
        navigate(`/locations/${params.id}`);
      }}
      onColumnVisibilityModelChange={processVisibilityChange}
      autoHeight
      hideFooterPagination
      sx={{ border: 0 }}
      initialState={{
        columns: { columnVisibilityModel: initialVisibilityState },
        sorting: {
          sortModel: [{ field: 'name', sort: 'asc' }]
        }
      }}
    />
  );
}

export default LocationsTable
