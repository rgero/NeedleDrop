import { Box, Chip } from '@mui/material';

import type { GridColDef } from '@mui/x-data-grid';
import type { Location } from '@interfaces/Location';
import type { User } from '@interfaces/User';
import type { Vinyl } from '@interfaces/Vinyl';
import { checkIsComplete } from './utils/CheckComplete';
import { stripArticles } from '@utils/StripArticles';

const baseColumnDefs: GridColDef[] = [
  { field: 'purchaseNumber', headerName: '#', width: 100, type: 'number' },
  { field: 'artist', 
    headerName: 'Artist', 
    width: 200,
    sortComparator: (v1, v2) => stripArticles(v1).localeCompare(stripArticles(v2))
  },
  { field: 'album', 
    headerName: 'Album', 
    width: 200,
    sortComparator: (v1, v2) => stripArticles(v1).localeCompare(stripArticles(v2))    
  },
  { field: 'purchaseDate', headerName: 'Purchase Date', width: 150, type: 'date' },
  { 
    field: 'purchaseLocation', 
    headerName: 'Purchase Location', 
    width: 200,
    valueGetter: (value: Location) => value?.name ?? '', 
  },
  { 
    field: 'owners', 
    headerName: 'Owners', 
    width: 200,
    valueGetter: (value: User[]) => value?.map(u => u.name).join(', ') ?? '',
  },
  { 
    field: 'purchasedBy', 
    headerName: 'Purchased By', 
    width: 200,
    valueGetter: (value: User[]) => value?.map(u => u.name).join(', ') ?? '',
  },
  { field: 'price', headerName: 'Price', width: 100, type: 'number' },
  { field: 'length', headerName: 'Length (min)', width: 130, type: 'number' },
  { field: 'playCount', headerName: 'Play Count', width: 130, type: 'number' },
  { 
    field: 'likedBy', 
    headerName: 'Liked By', 
    width: 200,
    valueGetter: (value: User[]) => value?.map(u => u.name).join(', ') ?? '',
  },
  { field: 'notes', headerName: 'Notes', width: 200 },
  { field: 'color', headerName: 'Color', width: 130 },
  { field: "doubleLP", headerName: "Double LP", type: "boolean", width: 100 },
  { 
    field: "tags", 
    headerName: "Tags", 
    width: 250,
    sortComparator: (v1: string[], v2: string[]) => {
      const t1 = v1 && v1.length > 0 ? v1[0] : "";
      const t2 = v2 && v2.length > 0 ? v2[0] : "";

      if (t1 === t2) return 0;
      
      // Forces empty values to the end in ASC
      if (t1 === "") return 1;
      if (t2 === "") return -1;

      return t1.localeCompare(t2);
    },
    renderCell: (params) => {
      const tags: string[] = params.value || [];
      return (
        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center', height: '100%' }}>
          {tags.map((tag, index) => (
            <Chip 
              key={index} 
              label={tag} 
              size="small" 
              variant="outlined" 
              sx={{ fontSize: '0.75rem' }}
            />
          ))}
        </Box>
      );
    }
  },
  { 
    field: "isComplete", 
    headerName: "Is Complete", 
    type: "boolean", 
    width: 100,
    valueGetter: (_value, row: Vinyl) => checkIsComplete(row)
  }
];

// Restricting the sorting order to Ascending/Descending.
export const VinylTableColumnDef: GridColDef[] = baseColumnDefs.map(col => ({
  ...col,
  sortingOrder: ['asc', 'desc']
}));