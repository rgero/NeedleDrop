import LocationStats from "./sections/LocationStats";
import PlaylogStats from "./sections/PlaylogStats";
import { Stack } from "@mui/material"
import VinylStats from "./sections/VinylStats";
import { useHouseholdStats } from "./hooks/useHouseholdStats";

const HouseholdStats = () => {
  const stats = useHouseholdStats();
  return (
    <Stack spacing={3} sx={{pb:3}}>
      <VinylStats stats={stats}/>
      <LocationStats stats={stats}/>
      <PlaylogStats stats={stats}/>
    </Stack>
  )
}

export default HouseholdStats
