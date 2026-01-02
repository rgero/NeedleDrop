import DataTablePresentation from "@pages/generics/DataTablePresentation"
import WantedItemsTable from "@components/wanted/WantedItemsTable"

const WantedItemsPage = () => {
  return (
    <DataTablePresentation title="Wanted Items" slug="wantlist">
      <WantedItemsTable/>
    </DataTablePresentation>
  )
}

export default WantedItemsPage
