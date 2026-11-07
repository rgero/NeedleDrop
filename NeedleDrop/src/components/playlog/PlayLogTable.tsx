import ReactTable from "@components/ui/tables/ReactTable";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useContext } from "react";
import { UserContext } from "@context/users/UserContext";
import { createPlayLogTableColumnDef, PlayLogTableColumnDef } from "./PlayLogTableColumnDef";

const PlaylogsTable = () => {
  const { playlogs } = usePlaylogContext();
  const userContext = useContext(UserContext);
  const columns = userContext
    ? createPlayLogTableColumnDef(userContext.getCurrentUserSettings()?.timeZone)
    : PlayLogTableColumnDef;

  return (
    <ReactTable
      columns={columns}
      data={playlogs}
      settingsColumn="playlogs"
    />
  );
};

export default PlaylogsTable;