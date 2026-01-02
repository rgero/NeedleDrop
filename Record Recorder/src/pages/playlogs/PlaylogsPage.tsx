import DataTablePresentation from "@pages/generics/DataTablePresentation"
import PlayLogTable from "@components/playlog/PlayLogTable"

const PlaylogsPage = () => {
  return (
    <DataTablePresentation title="Plays">
      <PlayLogTable/>
    </DataTablePresentation>
  )
}

export default PlaylogsPage
