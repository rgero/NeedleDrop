import DataTablePage from "@components/ui/DataTablePage";
import VinylsTable from "@components/vinyls/VinylsTable";
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import vinylColumns from "@components/vinyls/VinylsTableColumns";

const VinylsPage = () => {
  return (
    <DataTablePage
      title="Vinyls"
      headerActions={(
        <ColumnVisibilityButton
          columns={vinylColumns}
          settingsColumn="vinyls"
        />
      )}
    >
      <VinylsTable/>
    </DataTablePage>
  )
}

export default VinylsPage
