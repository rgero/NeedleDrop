import ReactTable from "@components/ui/tables/ReactTable";
import { useVinylContext } from "@context/vinyl/VinylContext";
import vinylColumns from "./VinylsTableColumns";

const UnplayedVinylsTable = () => {
  const { unplayedVinyls } = useVinylContext();

  return (
    <ReactTable
      data={unplayedVinyls}
      columns={vinylColumns}
      settingsColumn="vinyls"
    />
  );
};

export default UnplayedVinylsTable;