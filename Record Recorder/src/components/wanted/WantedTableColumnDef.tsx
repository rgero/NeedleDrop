import type { GridColDef } from '@mui/x-data-grid';
import type { User } from '@interfaces/User';

export const WantedItemTableColumnDef: GridColDef[] = [
  { field: 'artist', headerName: 'Artist', width: 200 },
  { field: 'album', headerName: 'Album', width: 200 },
  { field: 'imageUrl', 
    headerName: 'Cover', 
    width: 100,
    sortable: false,
    filterable: false,
    renderCell: (params) => (
      <img
        src={params.value ?? "record-player.svg"}
        alt=""
        style={{
          width: 48,
          height: 48,
          objectFit: "cover",
          borderRadius: 4,
        }}
      />
    )
  },
  { field: 'searcher',
    headerName: 'Searcher',
    width: 200,
    valueGetter: (value: User[]) => {
      return value?.map(u => u.name).join(', ') ?? '';
    },
  },
  { field: 'notes', headerName: 'Notes', width: 200 },
];
