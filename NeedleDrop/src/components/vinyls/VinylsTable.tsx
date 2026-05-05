import Loading from "@components/ui/Loading";
import ReactTable from "@components/ui/tables/ReactTable";
import type { Vinyl } from "@interfaces/Vinyl";
import { checkIsComplete } from "./utils/CheckComplete";
import { useVinylContext } from "@context/vinyl/VinylContext";
import vinylColumns from "./VinylsTableColumns";

const VinylsTable = () => {
  const { isLoading, vinyls } = useVinylContext();

  if (isLoading) return <Loading />;

  const checkComplete = (row: Vinyl) => {
    const isComplete = checkIsComplete(row);
    return {
      backgroundColor: isComplete ? 'inherit' : 'rgba(211, 47, 47, 0.15) !important',
      '&:hover': {
        backgroundColor: isComplete ? 'inherit' : 'rgba(211, 47, 47, 0.25) !important',
      }
    }
  };

  return (
    <ReactTable
      columns={vinylColumns}
      data={vinyls}
      settingsColumn="vinyls"
      getRowSx={(row) => checkComplete(row)}
    />
  );
};

export default VinylsTable;