import DataTablePage from "@components/ui/DataTablePage";
import UnplayedVinylsTable from "@components/vinyls/UnplayedVinylsTable";

const UnplayedVinylsPage = () => {
  return (
    <DataTablePage title="Unplayed Vinyls">
      <UnplayedVinylsTable/>
    </DataTablePage>
  )
}

export default UnplayedVinylsPage
