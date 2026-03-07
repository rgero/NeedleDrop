import DataTablePresentation from "@components/ui/DataTablePresentation";
import type { GridRowClassNameParams } from "@mui/x-data-grid";
import Loading from "@components/ui/Loading";
import type { Vinyl } from "@interfaces/Vinyl";
import { VinylTableColumnDef } from "./VinylsTableColumnDef";
import { checkIsComplete } from "./utils/CheckComplete";
import { useVinylContext } from "@context/vinyl/VinylContext";

const tableStyles = {
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

  if (isLoading) return <Loading />;

  return (
    <DataTablePresentation
      items={vinyls}
      columns={VinylTableColumnDef}
      slug="vinyls"
      settingsColumn="vinyls"
      sortModel={[{ field: 'purchaseNumber', sort: 'desc' }]}
      customTableStyle={tableStyles}
      customRowClass={(params: GridRowClassNameParams<Vinyl>) => 
        checkIsComplete(params.row) ? '' : 'row--incomplete'
      }
    />
  );
};

export default VinylsTable;