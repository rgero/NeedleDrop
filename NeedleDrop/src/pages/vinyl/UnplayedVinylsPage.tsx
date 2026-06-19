import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import DataTablePage from "@components/ui/DataTablePage";
import UnplayedVinylsTable from "@components/vinyls/UnplayedVinylsTable";
import vinylColumns from "@components/vinyls/VinylsTableColumns";

const UnplayedVinylsPage = () => {
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
      <UnplayedVinylsTable/>
    </DataTablePage>
  )
}

export default UnplayedVinylsPage
