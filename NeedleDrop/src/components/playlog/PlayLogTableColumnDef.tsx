import type { GridColDef } from '@mui/x-data-grid';
import type { User } from '@interfaces/User';
import { stripArticles } from '@utils/StripArticles';

export const PlayLogTableColumnDef: GridColDef[] = [
  { field: "playNumber",
    headerName: "#",
    width: 100,
    type: "number"
  },
  {
    field: 'date',
    headerName: 'Date',
    width: 125,
    type: 'date'
  },
  { 
    field: 'artist', 
    headerName: 'Artist', 
    width: 200,
    sortComparator: (v1, v2) => stripArticles(v1).localeCompare(stripArticles(v2))
  },
  { 
    field: 'album', 
    headerName: 'Album', 
    width: 200,
    sortComparator: (v1, v2) => stripArticles(v1).localeCompare(stripArticles(v2))
  },
  { field: 'listeners',
    headerName: 'Listeners',
    width: 200,
    valueGetter: (value: User[]) => {
      return value?.map(u => u.name).join(', ') ?? '';
    },
  },

];