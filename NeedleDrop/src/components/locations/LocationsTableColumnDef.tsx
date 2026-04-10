import type { GridColDef } from '@mui/x-data-grid';

export const LocationTableColumnDef: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 250 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'recommended', headerName: 'Recommended', width: 130, 
    valueFormatter: (value: boolean | null) => {
      if (value === true) return 'Yes';
      if (value === false) return 'No';
      return '';
    } 
  },
  { field: 'purchaseCount', headerName: 'Purchase Count', width: 150, type: 'number' },
  { field: 'percentage', headerName: 'Percentage', width: 150, type: 'number', valueFormatter: (value: number | null) => {
    if (value === null || value === undefined) return '';
    return `${value.toFixed(2)}%`;
  }},
  { field: 'notes', headerName: 'Notes', width: 200 },
];