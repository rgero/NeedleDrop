import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { VinylTableColumnDef } from "./VinylsTableColumnDef";
import { useVinylContext } from "@context/vinyl/VinylContext";

const VinylsTable = () => {
  const {vinyls} = useVinylContext(); 
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <DataGrid
        rows={vinyls}
        columns={VinylTableColumnDef}
        autoHeight
        hideFooterPagination
        sx={{ border: 0 }}
      />
    </Paper>
  );
}

export default VinylsTable
