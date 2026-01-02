import DataTablePresentation from "@components/ui/DataTablePresentation"
import WantedItemsTable from "@components/wanted/WantedItemsTable"

const WantedItemsPage = () => {
  return (
    <DataTablePresentation title="Wanted Albums" slug="wantlist">
      <WantedItemsTable/>
    </DataTablePresentation>
  )
}

export default WantedItemsPage
