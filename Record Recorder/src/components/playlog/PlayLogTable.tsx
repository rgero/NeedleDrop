import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { PlayLogTableColumnDef } from "./PlayLogTableColumnDef";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";

const PlayLogTable = () => {
  const {isLoading, playlogs} = usePlaylogContext();

  if (isLoading) return <div>Loading...</div>;
  
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <DataGrid
        rows={playlogs}
        columns={PlayLogTableColumnDef}
        autoHeight
        hideFooterPagination // Hides the bottom navigation bar
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default PlayLogTable
