import { Button, Grid, Paper, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { VinylTableColumnDef } from "./VinylsTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useVinylContext } from "@context/vinyl/VinylContext";

const VinylsTable = () => {
  const {vinyls} = useVinylContext();
  const navigate = useNavigate();
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid>
          <Typography variant="h6">Vinyls</Typography>
        </Grid>
        <Grid>
          <Button variant="contained" color="primary" onClick={() => navigate('/vinyls/create')}>
            Add New Vinyl
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        rows={vinyls}
        columns={VinylTableColumnDef}
        onRowClick={(params) => {
          navigate(`/vinyls/${params.id}`);
        }}
        autoHeight
        hideFooterPagination
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default VinylsTable
