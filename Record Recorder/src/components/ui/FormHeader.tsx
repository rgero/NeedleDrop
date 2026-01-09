import { Grid, IconButton, Typography } from "@mui/material"

import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"

const FormHeader = ({isCreateMode, slug}: {isCreateMode: boolean, slug: string}) => {
  const navigate = useNavigate();
  return (
    <Grid container alignItems="center" sx={{ mb: 4 }}>
      <IconButton 
        onClick={() => navigate(`/${slug}/`)} 
        sx={{ mr: 1 }}
      >
        <ArrowBack />
      </IconButton>
      <Typography 
        variant="h4" 
        sx={{ fontWeight: 'bold' }}
      >
        {isCreateMode ? "Add New" : "Details"}
      </Typography>
    </Grid>
  )
}

export default FormHeader
