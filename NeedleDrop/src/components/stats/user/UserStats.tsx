import { Divider, Paper, Stack, Typography } from "@mui/material"

import UserLocationStats from "./UserLocationStats";
import UserPlaylogStats from "./UserPlaylogStats";
import UserVinylStats from "./UserVinylStats";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";

const UserStats = () => {
  const {isLoading, user} = useAuthenticationContext();
  if (isLoading || !user) { return; }
  return (
    <Paper sx={{padding: 3}}>
      <Typography variant="h3">Your Stats</Typography>
      <Divider/>
      <Stack spacing={3}>
        <UserVinylStats userId={user.id}/>
        <UserLocationStats userId={user.id}/>
        <UserPlaylogStats userId={user.id}/>
      </Stack>
    </Paper>
  )
}

export default UserStats
