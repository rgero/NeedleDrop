import { Grid, IconButton, Typography } from "@mui/material"

import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom"

const FormHeader = ({isCreateMode, slug, rightAdornment = null}: {isCreateMode: boolean, slug: string, rightAdornment?: React.ReactNode}) => {
  const navigate = useNavigate();
  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
      <Grid container alignItems="center">
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
      {rightAdornment && (
        <Grid>
          {rightAdornment}
        </Grid>
      )}
    </Grid>
  )
}

export default FormHeader
