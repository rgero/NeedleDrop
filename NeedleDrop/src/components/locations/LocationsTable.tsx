import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import ReactTable from "@components/ui/tables/ReactTable";
import { useLocationContext } from "@context/location/LocationContext";

const LocationsTable = () => {
  const { locations } = useLocationContext();
  return (
    <ReactTable
      data={locations}
      columns={LocationTableColumnDef}
      settingsColumn="locations"
    />
  );
}

export default LocationsTable
