import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";

import { AddCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

type DataTablePageProps = {
  title: string,
  children: React.ReactNode,
  slug?: string | null,
  headerActions?: React.ReactNode,
}

const DataTablePage = ({title, children, slug = null, headerActions,}: DataTablePageProps) => {
  const navigate = useNavigate();

  const resolvedSlug = slug ?? title.toLowerCase();

  return (
    <Paper sx={{ width: '100%' }}>
      <Grid
        container
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2
        }}>
        <Grid>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid sx={{ display: "flex", alignItems: "center" }}>
          {headerActions}
          <IconButton onClick={() => navigate(`/${resolvedSlug}/create`)} sx={{ mr: 1 }}>
            <AddCircle fontSize="inherit"/>  
          </IconButton>
        </Grid>
      </Grid>
      <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '100%',
          }}
      >
        <Box
          sx={{
            width: 'fit-content',
            maxWidth: '100%',
          }}
        >
          {children}
        </Box>
      </Box>
    </Paper>
  );
}

export default DataTablePage
