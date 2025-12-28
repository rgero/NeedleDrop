import { DataGrid } from "@mui/x-data-grid";
import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import { Paper } from "@mui/material";
import { useLocationContext } from "@context/location/LocationContext";

const LocationsTable = () => {
  const {locations} = useLocationContext();
  const paginationModel = { page: 0, pageSize: 5 };
  
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <DataGrid
        rows={locations}
        columns={LocationTableColumnDef}
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default LocationsTable
