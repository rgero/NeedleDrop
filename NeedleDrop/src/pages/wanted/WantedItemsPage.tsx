import DataTablePage from "@components/ui/DataTablePage"
import WantedItemsTable from "@components/wanted/WantedItemsTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { WantedItemTableColumnDef } from "@components/wanted/WantedTableColumnDef";

const WantedItemsPage = () => {
  return (
    <DataTablePage
      title="Wanted Albums"
      slug="wantlist"
      headerActions={(
        <ColumnVisibilityButton
          columns={WantedItemTableColumnDef}
          settingsColumn="wantedItems"
        />
      )}
    >
      <WantedItemsTable/>
    </DataTablePage>
  )
}

export default WantedItemsPage
