import DataTablePresentation from "@components/ui/DataTablePresentation";
import VinylsTable from "@components/vinyls/VinylsTable"

const VinylsPage = () => {
  return (
    <DataTablePresentation title="Vinyls">
      <VinylsTable/>
    </DataTablePresentation>
  )
}

export default VinylsPage
