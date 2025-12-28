import { Button, Container, Typography } from "@mui/material";

import Loading from "@components/ui/Loading";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { useLocationContext } from "@context/location/LocationContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const DashboardPage = () => {
  const {logout} = useAuthenticationContext();
  const {locations, isLoading} = useLocationContext();
  const {vinyls, isLoading: vinylsLoading} = useVinylContext();

  if (isLoading || vinylsLoading)
  {
    return <Loading/>;
  }

  return (
    <Container>
      <Typography>You're logged in.</Typography>
      <Typography>Locations: {locations.length}</Typography>
      <Typography>Vinyls: {vinyls.length}</Typography>
      <Button variant="contained" color="primary" onClick={logout} sx={{marginTop: 2}}>Logout</Button>
    </Container>
  )
}

export default DashboardPage
