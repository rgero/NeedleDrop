import { CircularProgress, Container, Grid } from "@mui/material"

const Loading = () => {
  return (
    <Container disableGutters>
      <Grid
        container
        style={{height: "100vh"}}
        sx={{
          justifyContent: "center",
          alignItems: "center"
        }}>
        <CircularProgress />
      </Grid>
    </Container>
  );
}

export default Loading
