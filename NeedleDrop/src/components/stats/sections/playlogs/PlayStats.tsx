import { Box, Container, Grid, Typography } from "@mui/material"

import { DefaultSettings } from "@interfaces/settings/DefaultSettings"
import { RoundNumber } from "@utils/RoundNumber"
import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/ui/StatsAccordion"
import { useUserContext } from "@context/users/UserContext"

const PlayStats = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  const {getCurrentUserSettings} = useUserContext();

  const settings = getCurrentUserSettings() ?? DefaultSettings;

  const priceValue = settings.pricePerPlayValue ? stats.collectionValue : stats.pricePaid;

  return (
    <StatsAccordion title="Playlogs" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Container disableGutters sx={{width: {sm: "80%", lg:"50%"}}}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Total Plays
              </Grid>
              <Grid>
                {stats.totalPlays}
              </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Cost Per Play
              </Grid>
              <Grid>
                <Typography>${RoundNumber(priceValue/stats.totalPlays).toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </StatsAccordion>
  );
}

export default PlayStats;