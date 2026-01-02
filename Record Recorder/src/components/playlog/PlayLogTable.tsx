import { DataGrid } from "@mui/x-data-grid";
import { PlayLogTableColumnDef } from "./PlayLogTableColumnDef";
import { useNavigate } from "react-router-dom";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";

const PlayLogTable = () => {
  const {isLoading, playlogs} = usePlaylogContext();
  const navigate = useNavigate();

  if (isLoading) return <div>Loading...</div>;
  
  return (
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
  );
}

export default PlayLogTable
