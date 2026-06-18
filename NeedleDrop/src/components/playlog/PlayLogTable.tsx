import Loading from "@components/ui/Loading";
import ReactTable from "@components/ui/tables/ReactTable";
import { playlogColumns } from "./PlaylogTableHeader";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";

const PlaylogsTable = () => {
  const { isLoading, playlogs } = usePlaylogContext();

  if (isLoading) return <Loading />;

  return (
    <ReactTable
      columns={playlogColumns}
      data={playlogs}
      settingsColumn="playlogs"
    />
  );
};

export default PlaylogsTable;