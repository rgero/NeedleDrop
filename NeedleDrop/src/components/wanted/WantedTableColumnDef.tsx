import { Box, Chip, Typography } from '@mui/material';

import type { GridColDef } from '@mui/x-data-grid';
import type { User } from '@interfaces/User';
import type { Weight } from '@interfaces/WantedItem';

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
  {
    field: 'searcher',
    headerName: 'Searcher',
    width: 150,
    headerAlign: 'center',
    align: 'center',
    valueGetter: (value: User[]) => {
      if (!value || !Array.isArray(value)) return '';
      return value.map((u: User) => u.name).join(', ');
    },
    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
        }}
      >
        <Typography variant="body2">
          {params.value} 
        </Typography>
      </Box>
    ),
  },
  { field: 'created_at', headerName: 'Date Added', width: 150, type: 'date' },
  {
    field: "weight",
    headerName: "Weight",
    width: 120,
    sortable: true,

    sortComparator: (v1: Weight, v2: Weight) => {
      const order: Record<Weight, number> = { Low: 1, Medium: 2, High: 3 } as const;
      return order[v1] - order[v2];
    },

    renderCell: (params) => {
      const value = params.value as "Low" | "Medium" | "High";

      console.log(params);

      const colorMap = {
        Low: "default",
        Medium: "warning",
        High: "error",
      } as const;

      return (
        <Chip
          size="small"
          label={value.toUpperCase()}
          color={colorMap[value]}
        />
      );
    },
  },
  { field: 'notes', headerName: 'Notes', width: 200 },
];
