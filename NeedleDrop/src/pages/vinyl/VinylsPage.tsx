import DataTablePage from "@components/ui/DataTablePage";
import VinylsTable from "@components/vinyls/VinylsTable";
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import vinylColumns from "@components/vinyls/VinylsTableColumns";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";
import SuspenseTableWrapper from "@components/ui/SuspenseTableWrapper";

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
      <SuspenseTableWrapper>
        <VinylsTable/>
      </SuspenseTableWrapper>
    </DataTablePage>
  )
}

export default VinylsPage
