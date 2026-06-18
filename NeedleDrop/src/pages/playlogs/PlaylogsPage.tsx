import DataTablePage from "@components/ui/DataTablePage"
import PlayLogTable from "@components/playlog/PlayLogTable"
import ColumnVisibilityButton from "@components/ui/tables/ColumnVisibilityButton";
import { playlogColumns } from "@components/playlog/PlaylogTableHeader";
import ColumnFilterButton from "@components/ui/tables/ColumnFilterButton";

const PlaylogsPage = () => {
  return (
    <DataTablePage
      title="Plays"
      headerActions={(
        <>
          <ColumnVisibilityButton
            columns={playlogColumns}
            settingsColumn="playlogs"
          />
          <ColumnFilterButton columns={playlogColumns} />
        </>
      )}
    >
      <PlayLogTable/>
    </DataTablePage>
  )
}

export default PlaylogsPage
