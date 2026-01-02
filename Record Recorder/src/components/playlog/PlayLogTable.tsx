import { Button, Grid, Paper, Typography } from "@mui/material";

import { DataGrid } from "@mui/x-data-grid";
import { PlayLogTableColumnDef } from "./PlayLogTableColumnDef";
import { useNavigate } from "react-router-dom";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";

const PlayLogTable = () => {
  const {isLoading, playlogs} = usePlaylogContext();
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid>
          <Typography variant="h6">Plays</Typography>
        </Grid>
        <Grid>
          <Button variant="contained" color="primary" onClick={() => navigate('/plays/create')}>
            Create New Play
          </Button>
        </Grid>
      </Grid>
      <DataGrid
        rows={playlogs}
        columns={PlayLogTableColumnDef}
        onRowClick={(params) => {
          navigate(`/plays/${params.id}`);
        }}
        autoHeight
        hideFooterPagination // Hides the bottom navigation bar
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default PlayLogTable
