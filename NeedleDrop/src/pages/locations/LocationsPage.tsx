import DataTablePage from "@components/ui/DataTablePage"
import LocationsTable from "@components/locations/LocationsTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { LocationTableColumnDef } from "@components/locations/LocationsTableColumnDef";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";

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
      <LocationsTable/>
    </DataTablePage>
  )
}

export default LocationsPage
