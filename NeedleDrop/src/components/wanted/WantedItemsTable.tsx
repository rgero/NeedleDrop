import DataTablePresentation from "@components/ui/DataTablePresentation";
import Loading from "@components/ui/Loading";
import { WantedItemTableColumnDef } from "./WantedTableColumnDef";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const WantedItemsTable = () => {
  const { isLoading, wanteditems } = useWantedItemContext();
  
  if (isLoading) return <Loading />;

  return (
    <DataTablePresentation
      items={wanteditems}
      columns={WantedItemTableColumnDef}
      customRowClass={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even" : "odd"
      }
      slug="wantlist"
      settingsColumn="wantedItems"
      rowHeight={96}
    />
  );
}

export default WantedItemsTable;