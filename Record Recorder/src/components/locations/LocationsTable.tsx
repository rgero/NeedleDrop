import { DataGrid } from "@mui/x-data-grid";
import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import { Paper } from "@mui/material";
import { useLocationContext } from "@context/location/LocationContext";
import { useNavigate } from "react-router-dom";

const LocationsTable = () => {
  const {locations} = useLocationContext();
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 5 };
  
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <DataGrid
        rows={locations}
        columns={LocationTableColumnDef}
        initialState={{ pagination: { paginationModel } }}
        onRowClick={(params) => {
          navigate(`/locations/${params.id}`);
        }}
        pageSizeOptions={[5, 10]}
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default LocationsTable
