import Loading from "@components/ui/Loading";
import { LocationTableColumnDef } from "./LocationsTableColumnDef";
import ReactTable from "@components/ui/tables/ReactTable";
import { useLocationContext } from "@context/location/LocationContext";

const LocationsTable = () => {
  const {isLoading, locations} = useLocationContext();
  if (isLoading) return <Loading />;
  return (
    <ReactTable
      data={locations}
      columns={LocationTableColumnDef}
      settingsColumn="locations"
    />
  );
}

export default LocationsTable
