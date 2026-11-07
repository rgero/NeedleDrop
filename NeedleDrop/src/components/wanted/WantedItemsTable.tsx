import ReactTable from "@components/ui/tables/ReactTable";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";
import { useContext } from "react";
import { UserContext } from "@context/users/UserContext";
import { createWantedItemTableColumnDef, WantedItemTableColumnDef } from "./WantedTableColumnDef";

const WantedItemsTable = () => {
  const { wanteditems } = useWantedItemContext();
  const userContext = useContext(UserContext);
  const columns = userContext
    ? createWantedItemTableColumnDef(userContext.getCurrentUserSettings()?.timeZone)
    : WantedItemTableColumnDef;

  return (
    <ReactTable
      data={wanteditems}
      columns={columns}
      settingsColumn="wantedItems"
      getRowSx={(_) => {return {height: 100}}}
    />
  );
}

export default WantedItemsTable;