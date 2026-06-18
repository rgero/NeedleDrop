import DataTablePage from "@components/ui/DataTablePage"
import PlayLogTable from "@components/playlog/PlayLogTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { playlogColumns } from "@components/playlog/PlaylogTableHeader";

const PlaylogsPage = () => {
  return (
    <DataTablePage
      title="Plays"
      headerActions={(
        <ColumnVisibilityButton
          columns={playlogColumns}
          settingsColumn="playlogs"
        />
      )}
    >
      <PlayLogTable/>
    </DataTablePage>
  )
}

export default PlaylogsPage
