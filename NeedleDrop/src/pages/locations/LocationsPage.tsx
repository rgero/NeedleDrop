import DataTablePage from "@components/ui/DataTablePage"
import LocationsTable from "@components/locations/LocationsTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { LocationTableColumnDef } from "@components/locations/LocationsTableColumnDef";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";
import SuspenseTableWrapper from "@components/ui/SuspenseTableWrapper";

const LocationsPage = () => {
  return (
    <DataTablePage
      title="Locations"
      headerActions={(
        <>
          <ColumnVisibilityButton
            columns={LocationTableColumnDef}
            settingsColumn="locations"
          />
          <ColumnFilterButton columns={LocationTableColumnDef} />
        </>
      )}
    >
      <SuspenseTableWrapper>
        <LocationsTable/>
      </SuspenseTableWrapper>
    </DataTablePage>
  )
}

export default LocationsPage
