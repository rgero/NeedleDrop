import Loading from "@components/ui/Loading";
import ReactTable from "@components/ui/tables/ReactTable";
import { useVinylContext } from "@context/vinyl/VinylContext";
import vinylColumns from "./VinylsTableColumns";

const UnplayedVinylsTable = () => {
  const {isLoading, unplayedVinyls } = useVinylContext();

  if (isLoading) return <Loading />;

  return (
    <ReactTable
      data={unplayedVinyls}
      columns={vinylColumns}
      settingsColumn="vinyls"
    />
  );
};

export default UnplayedVinylsTable;