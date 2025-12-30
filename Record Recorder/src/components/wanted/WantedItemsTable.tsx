import { DataGrid } from "@mui/x-data-grid";
import { Paper } from "@mui/material";
import { WantedItemTableColumnDef } from "./WantedTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const WantedItemsTable = () => {
  const {wanteditems} = useWantedItemContext();
  const navigate = useNavigate();
  const paginationModel = { page: 0, pageSize: 5 };
  
  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <DataGrid
        rows={wanteditems}
        rowHeight={96}
        columns={WantedItemTableColumnDef}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
        }
        initialState={{ pagination: { paginationModel } }}
        pageSizeOptions={[5, 10, 25]}
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
      />
    </Paper>
  );
}

export default WantedItemsTable
