import type { GridColDef } from '@mui/x-data-grid';
import type { User } from '@interfaces/User';

export const PlayLogTableColumnDef: GridColDef[] = [
  { field: 'date', headerName: 'Date', width: 125, type: 'date' },
  { field: 'artist', headerName: 'Artist', width: 200 },
  { field: 'album', headerName: 'Album', width: 200 },
  { field: 'listeners',
    headerName: 'Listeners',
    width: 200,
    valueGetter: (value: User[]) => {
      return value?.map(u => u.name).join(', ') ?? '';
    },
  },

];