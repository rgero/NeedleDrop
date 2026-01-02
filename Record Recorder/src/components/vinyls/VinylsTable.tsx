import { DataGrid } from "@mui/x-data-grid";
import { VinylTableColumnDef } from "./VinylsTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useVinylContext } from "@context/vinyl/VinylContext";

const VinylsTable = () => {
  const {vinyls} = useVinylContext();
  const navigate = useNavigate();
  return (
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
  );
}

export default VinylsTable
