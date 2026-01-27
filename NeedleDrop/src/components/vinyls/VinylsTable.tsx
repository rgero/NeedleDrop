import { DataGrid, type GridColumnVisibilityModel, type GridRowClassNameParams } from "@mui/x-data-grid";
import { VinylTableColumnDef } from "./VinylsTableColumnDef";
import { useNavigate } from "react-router-dom";
import { useVinylContext } from "@context/vinyl/VinylContext";
import { checkIsComplete } from "./utils/CheckComplete";
import type { Vinyl } from "@interfaces/Vinyl";
import { useUserContext } from "@context/users/UserContext";
import Loading from "@components/ui/Loading";
import { DefaultSettings, type VinylSettings } from "@interfaces/UserSettings";
import { useMemo } from "react";

const tableStyles = {
  border: 0,
  '& .row--incomplete': {
    backgroundColor: 'rgba(211, 47, 47, 0.08)',
    '&:hover': { backgroundColor: 'rgba(211, 47, 47, 0.12)' },
  },
  '& .row--incomplete .MuiDataGrid-cell[data-field="isComplete"]': {
    color: '#d32f2f',
    fontWeight: 'bold',
  }
};

const VinylsTable = () => {
  const {isLoading, vinyls } = useVinylContext();
  const navigate = useNavigate();
  const {isLoading: isSettingsLoading, getCurrentUserSettings, updateCurrentUserSettings} = useUserContext();
  
  const initialVisibilityState = useMemo(() => 
    getCurrentUserSettings()?.vinyls ?? DefaultSettings.vinyls, 
  [getCurrentUserSettings]);

  if (isLoading || isSettingsLoading) return <Loading />;

  const processVisibilityChange = (newModel: GridColumnVisibilityModel) => {
    updateCurrentUserSettings({
      vinyls: newModel as VinylSettings
    });
  };

  return (
    <DataGrid
      rows={vinyls}
      columns={VinylTableColumnDef}
      onRowClick={(params) => {
        navigate(`/vinyls/${params.id}`);
      }}
      onColumnVisibilityModelChange={processVisibilityChange}
      autoHeight
      getRowClassName={(params: GridRowClassNameParams<Vinyl>) => 
        checkIsComplete(params.row) ? '' : 'row--incomplete'
      }
      sx={tableStyles}
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