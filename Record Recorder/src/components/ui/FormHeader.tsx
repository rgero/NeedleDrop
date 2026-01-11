import { Grid, Typography } from "@mui/material"

const FormHeader = ({isCreateMode,rightAdornment = null}: {isCreateMode: boolean, rightAdornment?: React.ReactNode}) => {
  return (
    <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
      <Grid container alignItems="center">
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
