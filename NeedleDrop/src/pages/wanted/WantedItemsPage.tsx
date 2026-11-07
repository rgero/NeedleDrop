import DataTablePage from "@components/ui/DataTablePage"
import WantedItemsTable from "@components/wanted/WantedItemsTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { WantedItemTableColumnDef } from "@components/wanted/WantedTableColumnDef";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";
import SuspenseTableWrapper from "@components/ui/SuspenseTableWrapper";
const WantedItemsPage = () => {
  const columns = WantedItemTableColumnDef;
  return (
    <DataTablePage
      title="Wanted Albums"
      slug="wantlist"
      headerActions={(
        <>
          <ColumnVisibilityButton
            columns={columns}
            settingsColumn="wantedItems"
          />
          <ColumnFilterButton columns={columns} settingsColumn="wantedItems" />
        </>
      )}
    >
      <SuspenseTableWrapper>
        <WantedItemsTable/>
      </SuspenseTableWrapper>
    </DataTablePage>
  )
}

export default WantedItemsPage
