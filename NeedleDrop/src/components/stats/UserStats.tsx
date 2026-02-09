import { Divider, Stack } from "@mui/material"

import LocationStats from "./sections/LocationStats";
import PlaylogStats from "./sections/PlaylogStats";
import VinylStats from "./sections/VinylStats";
import { useUserStats } from "./hooks/useUserStats";

const UserStats = () => {
  const stats = useUserStats();
  return (
    <Stack spacing={3} sx={{pb: 3}}>
      <VinylStats stats={stats}/>
      <Divider/>
      <LocationStats stats={stats}/>
      <Divider/>
      <PlaylogStats stats={stats}/>
    </Stack>
  )
}

export default UserStats
