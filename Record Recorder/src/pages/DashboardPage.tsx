import { Button, Container, Typography } from "@mui/material";

import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";

const DashboardPage = () => {
  const {logout} = useAuthenticationContext();
  return (
    <Container>
      <Typography>You're logged in.</Typography>
      <Button variant="contained" color="primary" onClick={logout} sx={{marginTop: 2}}>Logout</Button>
    </Container>
  )
}

export default DashboardPage
