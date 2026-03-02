import { Container, Grid, IconButton, Typography, lighten, useTheme } from "@mui/material"

import { DefaultSettings } from "@interfaces/UserSettings"
import Loading from "@components/ui/Loading"
import LocationStats from "./sections/LocationStats"
import PlayStats from "./sections/playlogs/PlayStats"
import PlaysByAlbum from "./sections/playlogs/PlaysByAlbum"
import PlaysByDays from "./sections/playlogs/PlaysByDays"
import PlaysByTimelineChart from "./sections/playlogs/PlaysByTimelineChart"
import { Settings } from "@mui/icons-material"
import type { Stats } from "@interfaces/Stats"
import TopPlayDates from "./sections/playlogs/TopPlayDates"
import VinylOwnership from "./sections/vinyls/VinylOwnership"
import VinylTopArtists from "./sections/vinyls/VinylTopArtists"
import { useDialogProvider } from "@context/dialog/DialogContext"
import { useExpandedSections } from "./hooks/useExpandedSections"
import { useUserContext } from "@context/users/UserContext"

interface BaseStatsProps {
  title: string;
  stats: Stats;
  settingsKeys: {
    expanded: 'houseStatsExpandedSections' | 'userStatsExpandedSections';
    order: 'houseStatsSectionOrder' | 'userStatsSectionOrder';
  };
}

const BaseStatsContainer = ({ title, stats, settingsKeys }: BaseStatsProps) => {
  const { isLoading, getCurrentUserSettings, updateCurrentUserSettings } = useUserContext()
  const { toggleStatsOrderDialog } = useDialogProvider();
  const theme = useTheme();

  const settings = getCurrentUserSettings();
  const initialExpanded = settings?.[settingsKeys.expanded] ?? DefaultSettings[settingsKeys.expanded];
  
  const { expandedSections, handleToggle } = useExpandedSections(initialExpanded, (updated) => updateCurrentUserSettings({ [settingsKeys.expanded]: updated }))
  const initialSectionOrder = settings?.[settingsKeys.order] ?? DefaultSettings[settingsKeys.order]

  const sectionMap: Record<string, React.ReactNode> = {
    vinyls: <VinylOwnership stats={stats} expanded={expandedSections.vinyls} onToggle={(exp) => handleToggle("vinyls", exp)} />,
    topArtists: <VinylTopArtists stats={stats} expanded={expandedSections.topArtists} onToggle={(exp) => handleToggle("topArtists", exp)} />,
    locations: <LocationStats stats={stats} expanded={expandedSections.locations} onToggle={(exp) => handleToggle("locations", exp)} />,
    playlogs: <PlayStats stats={stats} expanded={expandedSections.playlogs} onToggle={(exp) => handleToggle("playlogs", exp)} />,
    topPlayDays: <TopPlayDates stats={stats} expanded={expandedSections.topPlayDays} onToggle={(exp) => handleToggle("topPlayDays", exp)} />,
    playsByDays: <PlaysByDays stats={stats} expanded={expandedSections.playsByDays} onToggle={(exp) => handleToggle("playsByDays", exp)} />,
    playsByAlbum: <PlaysByAlbum stats={stats} expanded={expandedSections.playsByAlbum} onToggle={(exp) => handleToggle("playsByAlbum", exp)} />,
    playsByTimelineChart: <PlaysByTimelineChart stats={stats} expanded={expandedSections.playsByTimelineChart} onToggle={(exp) => handleToggle("playsByTimelineChart", exp)} />,
  };

  if (isLoading) return <Loading />

  return (
    <Container sx={{ backgroundColor: lighten(theme.palette.background.paper, 0.03), paddingTop: 1 }}>
      <Grid container justifyContent="space-between" alignItems="center" paddingBottom={2}>
        <Grid>
          <Typography variant="h5">{title}</Typography>
        </Grid>
        <Grid>
          <IconButton 
            size="small" 
            onClick={() => toggleStatsOrderDialog(true, settingsKeys.order)}
          >
            <Settings />
          </IconButton>
        </Grid>
      </Grid>

      {initialSectionOrder.map(sectionKey => (
        <div key={sectionKey}>{sectionMap[sectionKey]}</div>
      ))}
    </Container>
  )
}

export default BaseStatsContainer;