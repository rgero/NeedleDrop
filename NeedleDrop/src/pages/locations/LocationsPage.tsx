import DataTablePage from "@components/ui/DataTablePage"
import LocationsTable from "@components/locations/LocationsTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { LocationTableColumnDef } from "@components/locations/LocationsTableColumnDef";

const LocationsPage = () => {
  return (
    <DataTablePage
      title="Locations"
      headerActions={(
        <ColumnVisibilityButton
          columns={LocationTableColumnDef}
          settingsColumn="locations"
        />
      )}
    >
      <LocationsTable/>
    </DataTablePage>
  )
}

export default LocationsPage
