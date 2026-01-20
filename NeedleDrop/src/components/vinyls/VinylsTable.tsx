import { DataGrid } from "@mui/x-data-grid";
import { VinylTableColumnDef } from "./VinylsTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useVinylContext } from "@context/vinyl/VinylContext";

const VinylsTable = () => {
  const {vinyls} = useVinylContext();
  const navigate = useNavigate();

  const initialVisibilityState = {
    purchaseNumber: true,
    artist: true,
    album: true,
    owners: true,
    purchasedBy: false,
    purchaseDate: false,
    purchaseLocation: false,
    price: false,
    length: false,
    playCount: false,
    likedBy: false,
    notes: false,
    color: false,
    doubleLP: false
  };

  return (
    <DataGrid
      rows={vinyls}
      columns={VinylTableColumnDef}
      onRowClick={(params) => {
        navigate(`/vinyls/${params.id}`);
      }}
      autoHeight
      sx={{ border: 0 }}
      initialState={{
        columns: {columnVisibilityModel: initialVisibilityState},
        sorting: {
          sortModel: [{ field: 'purchaseNumber', sort: 'asc' }],
        },
        pagination: {
          paginationModel: { pageSize: 100, page: 0 },
        },
      }}
    />
  );
}

export default VinylsTable
