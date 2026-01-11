import { Grid, IconButton, Paper, Typography } from "@mui/material";

import { AddCircle } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const DataTablePresentation = ({title, children, slug = null}: {title: string, children: React.ReactNode, slug?: string|null}) => {
  const navigate = useNavigate();

  if (!slug) {
    slug = title.toLowerCase();
  }

  return (
    <Paper sx={{ height: "90%", width: '100%' }}>
      <Grid container justifyContent="space-between" alignItems="center" padding={2}>
        <Grid>
          <Typography variant="h6">{title}</Typography>
        </Grid>
        <Grid>
          <IconButton onClick={() => navigate(`/${slug}/create`)} sx={{ mr: 1 }}>
            <AddCircle fontSize="inherit"/>  
          </IconButton>
        </Grid>
      </Grid>
      {children}
    </Paper>
  )
}

export default DataTablePresentation
