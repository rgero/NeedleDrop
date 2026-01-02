import { DataGrid } from "@mui/x-data-grid";
import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import { useLocationContext } from "@context/location/LocationContext";
import { useNavigate } from "react-router-dom";

const LocationsTable = () => {
  const {locations} = useLocationContext();
  const navigate = useNavigate();
  
  return (
    <DataGrid
      rows={locations}
      columns={LocationTableColumnDef}
      onRowClick={(params) => {
        navigate(`/locations/${params.id}`);
      }}
      autoHeight
      hideFooterPagination
      sx={{ border: 0 }}
    />
  );
}

export default LocationsTable
