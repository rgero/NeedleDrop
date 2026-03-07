import DataTablePresentation from "@components/ui/DataTablePresentation";
import Loading from "@components/ui/Loading";
import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import { useLocationContext } from "@context/location/LocationContext";

const LocationsTable = () => {
  const {isLoading, locations} = useLocationContext();
  if (isLoading) return <Loading />;
  return (
    <DataTablePresentation
      items={locations}
      columns={LocationTableColumnDef}
      sortModel={[{ field: 'name', sort: 'asc' }]}
      slug="locations"
      settingsColumn="locations"
    />
  );
}

export default LocationsTable
