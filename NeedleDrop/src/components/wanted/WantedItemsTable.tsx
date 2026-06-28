import ReactTable from "@components/ui/tables/ReactTable";
import { WantedItemTableColumnDef } from "./WantedTableColumnDef";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const WantedItemsTable = () => {
  const { wanteditems } = useWantedItemContext();

  return (
    <ReactTable
      data={wanteditems}
      columns={WantedItemTableColumnDef}
      settingsColumn="wantedItems"
      getRowSx={(_) => {return {height: 100}}}
    />
  );
}

export default WantedItemsTable;