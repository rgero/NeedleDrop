import { Box } from '@mui/material';
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
    renderCell: (params) => {
      const imgSrc = params.value && params.value !== "" ? params.value : "/BlackBox.png"; 

      return (
        <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img
            src={imgSrc}
            alt="Album Cover"
            style={{
              width: 96,
              height: 96,
              objectFit: "cover",
              borderRadius: 4,
              display: 'block'
            }}
            // Fallback if the URL itself is broken (404)
            onError={(e) => { (e.target as HTMLImageElement).src = "/BlackBox.png"; }}
          />
        </Box>
      );
    }
  },
  { field: 'searcher',
    headerName: 'Searcher',
    width: 200,
    valueGetter: (value: User[]) => {
      return value?.map(u => u.name).join(', ') ?? '';
    },
  },
  { field: 'created_at', headerName: 'Date Added', width: 150, type: 'date' },
  { field: 'notes', headerName: 'Notes', width: 200 },
];
