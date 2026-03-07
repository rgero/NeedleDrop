import DataTablePage from "@components/ui/DataTablePage"
import PlayLogTable from "@components/playlog/PlayLogTable"

const PlaylogsPage = () => {
  return (
    <DataTablePage title="Plays">
      <PlayLogTable/>
    </DataTablePage>
  )
}

export default PlaylogsPage
