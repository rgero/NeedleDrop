import { DefaultSettings, type HouseStatsExpandedSections } from "@interfaces/UserSettings";
import Loading from "@components/ui/Loading";
import LocationStats from "./sections/LocationStats";
import PlaylogStats from "./sections/PlaylogStats";
import VinylStats from "./sections/VinylStats";
import { useExpandedSections } from "./hooks/useExpandedSections";
import { useHouseholdStats } from "./hooks/useHouseholdStats";
import { useUserContext } from "@context/users/UserContext";
import { Container, Typography } from "@mui/material";

const HouseholdStats = () => {
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext()
  const stats = useHouseholdStats();

  const initial: HouseStatsExpandedSections = getCurrentUserSettings()?.houseStatsExpandedSections ?? DefaultSettings.houseStatsExpandedSections
  const { expandedSections, handleToggle } = useExpandedSections<HouseStatsExpandedSections>(initial, (updated) => updateCurrentUserSettings({houseStatsExpandedSections: updated}))

  if (isLoading) return <Loading />

  return (
    <Container
      sx={{
        backgroundColor: 'background.default',
        paddingTop: 1
      }}
    >
      <Typography variant="h4"paddingBottom={2}>Household Stats</Typography>
      <VinylStats stats={stats} expandedSections={expandedSections} onToggle={handleToggle}/>
      <LocationStats stats={stats} expandedSections={expandedSections} onToggle={handleToggle}/>
      <PlaylogStats stats={stats} expandedSections={expandedSections} onToggle={handleToggle}/>
    </Container>
  )
}

export default HouseholdStats
