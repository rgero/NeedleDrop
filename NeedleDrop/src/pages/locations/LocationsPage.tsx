import DataTablePage from "@components/ui/DataTablePage"
import LocationsTable from "@components/locations/LocationsTable"

const LocationsPage = () => {
  return (
    <DataTablePage title="Locations">
      <LocationsTable/>
    </DataTablePage>
  )
}

export default LocationsPage
