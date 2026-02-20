import { Container, Typography } from "@mui/material"

import { DefaultSettings } from "@interfaces/UserSettings"
import Loading from "@components/ui/Loading"
import LocationStats from "./sections/LocationStats"
import PlaylogStats from "./sections/PlaylogStats"
import type { UserStatsExpandedSections } from "@interfaces/UserSettings"
import VinylStats from "./sections/VinylStats"
import { useExpandedSections } from "./hooks/useExpandedSections"
import { useUserContext } from "@context/users/UserContext"
import { useUserStats } from "./hooks/useUserStats"

const UserStats = () => {
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext()
  const stats = useUserStats()

  const initial: UserStatsExpandedSections = getCurrentUserSettings()?.userStatsExpandedSections ?? DefaultSettings.userStatsExpandedSections
  const { expandedSections, handleToggle } = useExpandedSections<UserStatsExpandedSections>(initial, (updated) => updateCurrentUserSettings({userStatsExpandedSections: updated}))

  if (isLoading) return <Loading />

  return (
    <Container
      sx={{
        backgroundColor: 'background.default',
        paddingTop: 1
      }}
    >
      <Typography variant="h4" paddingBottom={2}>User Stats</Typography>
      <VinylStats<UserStatsExpandedSections>
        stats={stats}
        expandedSections={expandedSections}
        onToggle={handleToggle}
      />
      <LocationStats<UserStatsExpandedSections>
        stats={stats}
        expandedSections={expandedSections}
        onToggle={handleToggle}
      />
      <PlaylogStats<UserStatsExpandedSections>
        stats={stats}
        expandedSections={expandedSections}
        onToggle={handleToggle}
      />
    </Container>
  )
}

export default UserStats