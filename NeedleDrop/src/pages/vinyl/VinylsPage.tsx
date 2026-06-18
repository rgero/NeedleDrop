import DataTablePage from "@components/ui/DataTablePage";
import VinylsTable from "@components/vinyls/VinylsTable";
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import vinylColumns from "@components/vinyls/VinylsTableColumns";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";

const VinylsPage = () => {
  return (
    <DataTablePage
      title="Vinyls"
      headerActions={(
        <>
          <ColumnVisibilityButton
            columns={vinylColumns}
            settingsColumn="vinyls"
          />
          <ColumnFilterButton columns={vinylColumns} />
        </>
      )}
    >
      <VinylsTable/>
    </DataTablePage>
  )
}

export default VinylsPage
