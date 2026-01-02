import { Button, Grid, Paper, Typography } from "@mui/material";

import pluralize from 'pluralize';
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
          <Button variant="contained" color="primary" onClick={() => navigate(`/${slug}/create`)}>
            Add New {pluralize.singular(title)}
          </Button>
        </Grid>
      </Grid>
      {children}
    </Paper>
  )
}

export default DataTablePresentation
