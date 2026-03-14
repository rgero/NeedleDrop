import DataTablePresentation from "@components/ui/DataTablePresentation";
import Loading from "@components/ui/Loading";
import { PlayLogTableColumnDef } from "./PlayLogTableColumnDef";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";

const PlayLogTable = () => {
  const {isLoading, playlogs} = usePlaylogContext();
  if (isLoading) return <Loading />;
  
  return (
    <DataTablePresentation
      items={playlogs}
      columns={PlayLogTableColumnDef}
      slug="plays"
      settingsColumn="playlogs"
    />
  );
}

export default PlayLogTable
