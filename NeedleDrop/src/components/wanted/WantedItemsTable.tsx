import Loading from "@components/ui/Loading";
import ReactTable from "@components/ui/tables/ReactTable";
import { WantedItemTableColumnDef } from "./WantedTableColumnDef";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const WantedItemsTable = () => {
  const { isLoading, wanteditems } = useWantedItemContext();
  
  if (isLoading) return <Loading />;

  return (
    <ReactTable
      data={wanteditems}
      columns={WantedItemTableColumnDef}
      settingsColumn="wantedItems"
    />
  );
}

export default WantedItemsTable;