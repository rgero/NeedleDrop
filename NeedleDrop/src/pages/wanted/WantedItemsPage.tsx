import DataTablePage from "@components/ui/DataTablePage"
import WantedItemsTable from "@components/wanted/WantedItemsTable"

const WantedItemsPage = () => {
  return (
    <DataTablePage title="Wanted Albums" slug="wantlist">
      <WantedItemsTable/>
    </DataTablePage>
  )
}

export default WantedItemsPage
