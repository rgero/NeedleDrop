import { CircularProgress, Container, Grid } from "@mui/material"

const Loading = () => {
  return (
    <Container disableGutters>
      <Grid justifyContent="center" alignItems="center" container style={{height: "100vh"}}>
        <CircularProgress />
      </Grid>
    </Container>
  )
}

export default Loading
