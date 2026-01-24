import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { WantedItemTableColumnDef } from "./WantedTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const WantedItemsTable = () => {
  const {wanteditems} = useWantedItemContext();
  const navigate = useNavigate();
  
  const initialVisibilityState = {
    artist: true,
    album: true,
    imageUrl: true,
    searcher: true,
    weight: true,
    created_at: false,
    notes: false
  };

  return (
    <Paper sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={wanteditems}
        rowHeight={96}
        columns={WantedItemTableColumnDef}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        autoHeight
        hideFooterPagination
        onRowClick={(params) => {
          navigate(`/wantlist/${params.id}`);
        }}
        sx={{
          "& .even": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
          "& .odd": {
            backgroundColor: "transparent",
          },
        }}
        initialState={{
          columns: { columnVisibilityModel: initialVisibilityState },
          sorting: {
            sortModel: [{ field: 'artist', sort: 'asc' }],
          },
        }}
      />
    </Paper>
  );
}

export default WantedItemsTable
