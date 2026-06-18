import DataTablePage from "@components/ui/DataTablePage"
import WantedItemsTable from "@components/wanted/WantedItemsTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { WantedItemTableColumnDef } from "@components/wanted/WantedTableColumnDef";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";

const WantedItemsPage = () => {
  return (
    <DataTablePage
      title="Wanted Albums"
      slug="wantlist"
      headerActions={(
        <>
          <ColumnVisibilityButton
            columns={WantedItemTableColumnDef}
            settingsColumn="wantedItems"
          />
          <ColumnFilterButton columns={WantedItemTableColumnDef} />
        </>
      )}
    >
      <WantedItemsTable/>
    </DataTablePage>
  )
}

export default WantedItemsPage
