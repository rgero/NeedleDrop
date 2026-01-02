import { Button, Grid, Paper, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import { useLocationContext } from "@context/location/LocationContext";
import { useNavigate } from "react-router-dom";

const LocationsTable = () => {
  const {locations} = useLocationContext();
  const navigate = useNavigate();
  
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid>
          <Typography variant="h6">Locations</Typography>
        </Grid>
        <Grid>
          <Button variant="contained" color="primary" onClick={() => navigate('/locations/create')}>
            Create New Location
          </Button>
        </Grid>
      </Grid>
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
    </Paper>
  );
}

export default LocationsTable
