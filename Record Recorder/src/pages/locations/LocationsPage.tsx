import DataTablePresentation from "@pages/generics/DataTablePresentation"
import LocationsTable from "@components/header/locations/LocationsTable"

const LocationsPage = () => {
  return (
    <DataTablePresentation title="Locations">
      <LocationsTable/>
    </DataTablePresentation>
  )
}

export default LocationsPage
