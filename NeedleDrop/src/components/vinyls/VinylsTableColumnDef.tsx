import type { GridColDef } from '@mui/x-data-grid';
import type { Location } from '@interfaces/Location';
import type { User } from '@interfaces/User';

export const VinylTableColumnDef: GridColDef[] = [
  { field: 'purchaseNumber', headerName: '#', width: 100, type: 'number' },
  { field: 'artist', headerName: 'Artist', width: 200 },
  { field: 'album', headerName: 'Album', width: 200 },
  { field: 'purchaseDate', headerName: 'Purchase Date', width: 150, type: 'date' },
  { field: 'purchaseLocation', 
    headerName: 'Purchase Location', 
    width: 200,
    valueGetter: (value: Location) => value?.name ?? '', 
  },
  { field: 'owners', 
    headerName: 'Owners', 
    width: 200,
    valueGetter: (value: User[]) => {
      return value?.map(u => u.name).join(', ') ?? '';
    },
  },
  { field: 'purchasedBy', 
    headerName: 'Purchased By', 
    width: 200,
    valueGetter: (value: User[]) => {
      return value?.map(u => u.name).join(', ') ?? '';
    },
  },
  { field: 'price', headerName: 'Price', width: 100, type: 'number' },
  { field: 'length', headerName: 'Length (min)', width: 130, type: 'number' },
  { field: 'playCount', headerName: 'Play Count', width: 130, type: 'number' },
  { field: 'likedBy', 
    headerName: 'Liked By', 
    width: 200,
    valueGetter: (value: User[]) => {
      return value?.map(u => u.name).join(', ') ?? '';
    },
  },
  { field: 'notes', headerName: 'Notes', width: 200 },
  { field: 'color', headerName: 'Color', width: 130  },
  { field: "doubleLP", headerName: "Double LP", type: "boolean", width: 100}
];
