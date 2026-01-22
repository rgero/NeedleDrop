import { DataGrid, type GridRowClassNameParams } from "@mui/x-data-grid";
import { VinylTableColumnDef } from "./VinylsTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useVinylContext } from "@context/vinyl/VinylContext";
import { checkIsComplete } from "./utils/CheckComplete";
import type { Vinyl } from "@interfaces/Vinyl";

const VinylsTable = () => {
  const { vinyls } = useVinylContext();
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
    doubleLP: false,
    isComplete: false, 
  };

  return (
    <DataGrid
      rows={vinyls}
      columns={VinylTableColumnDef}
      onRowClick={(params) => {
        navigate(`/vinyls/${params.id}`);
      }}
      autoHeight
      // Apply the 'row--incomplete' class if the helper returns false
      getRowClassName={(params: GridRowClassNameParams<Vinyl>) => 
        checkIsComplete(params.row) ? '' : 'row--incomplete'
      }
      sx={{ 
        border: 0,
        // Style for the incomplete rows
        '& .row--incomplete': {
          backgroundColor: 'rgba(211, 47, 47, 0.08)', // Light red tint
          '&:hover': {
            backgroundColor: 'rgba(211, 47, 47, 0.12)',
          },
        },
        // Optional: ensure the Boolean checkbox or text in 'isComplete' is distinct
        '& .row--incomplete .MuiDataGrid-cell[data-field="isComplete"]': {
          color: '#d32f2f',
          fontWeight: 'bold',
        }
      }}
      initialState={{
        columns: { columnVisibilityModel: initialVisibilityState },
        sorting: {
          sortModel: [{ field: 'purchaseNumber', sort: 'desc' }],
        },
        pagination: {
          paginationModel: { pageSize: 100, page: 0 },
        },
      }}
    />
  );
};

export default VinylsTable;