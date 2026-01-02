import DataTablePresentation from "@pages/generics/DataTablePresentation";
import VinylsTable from "@components/vinyls/VinylsTable"

const VinylsPage = () => {
  return (
    <DataTablePresentation title="Vinyls">
      <VinylsTable/>
    </DataTablePresentation>
  )
}

export default VinylsPage
