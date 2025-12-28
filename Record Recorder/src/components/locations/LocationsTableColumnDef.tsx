import type { GridColDef } from '@mui/x-data-grid';

export const LocationTableColumnDef: GridColDef[] = [
  { field: 'name', headerName: 'Name', width: 250 },
  { field: 'address', headerName: 'Address', width: 200 },
  { field: 'recommended', headerName: 'Recommended', width: 130, type: 'boolean' },
  { field: 'purchaseCount', headerName: 'Purchase Count', width: 150, type: 'number' },
  { field: 'notes', headerName: 'Notes', width: 200 },
];