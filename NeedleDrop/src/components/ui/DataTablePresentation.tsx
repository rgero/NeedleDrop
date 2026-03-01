import { Box, Grid, IconButton, Paper, Typography } from "@mui/material";

import { AddCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DataTablePresentation = ({title, children, slug = null}: {title: string, children: React.ReactNode, slug?: string|null}) => {
  const navigate = useNavigate();

  if (!slug) {
    slug = title.toLowerCase();
  }

  return (
    <Paper sx={{ width: '100%' }}>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid>
          <IconButton onClick={() => navigate(`/${slug}/create`)} sx={{ mr: 1 }}>
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
  )
}

export default DataTablePresentation
