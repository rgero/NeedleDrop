import ReactTable from "@components/ui/tables/ReactTable";
import { playlogColumns } from "./PlaylogTableHeader";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";

const PlaylogsTable = () => {
  const { playlogs } = usePlaylogContext();

  return (
    <ReactTable
      columns={playlogColumns}
      data={playlogs}
      settingsColumn="playlogs"
    />
  );
};

export default PlaylogsTable;