import { Box, Container, Divider, Grid } from "@mui/material";

import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/ui/StatsAccordion";
import { differenceInDays } from "date-fns";
import { useUserContext } from "@context/users/UserContext";

const VinylOwnership = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  const { getCurrentUserSettings } = useUserContext();

  const calculateRecordsPerDay = (numberOfVinyls: number) => {
    const userSettings = getCurrentUserSettings();
    const startDate = userSettings?.statsStartDate ? new Date(userSettings.statsStartDate) : new Date();
    const daysSinceObtained = differenceInDays(new Date(), startDate) || 1;
    return Math.round( numberOfVinyls / daysSinceObtained * 100) / 100;
  }

  return (
    <StatsAccordion title="Vinyls" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Container disableGutters sx={{width: {sm: "80%", lg:"50%"}}}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Total Records Owned
              </Grid>
              <Grid>
                {stats.totalOwned}
              </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Collection Value
              </Grid>
              <Grid>
                ${Number(stats.collectionValue).toFixed(2)}
              </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Records Per Day
              </Grid>
              <Grid>
                {calculateRecordsPerDay(stats.totalOwned)}
              </Grid>
            </Grid>
          </Box>
          
          <Divider/>
          
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Total Records Bought
              </Grid>
              <Grid>
                {stats.totalBought}
              </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Total Spent
              </Grid>
              <Grid>
                ${Number(stats.pricePaid).toFixed(2)}
              </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: "space-between" }}>
              <Grid>
                Records Per Day
              </Grid>
              <Grid>
                {calculateRecordsPerDay(stats.totalBought)}
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </StatsAccordion>
  );
}

export default VinylOwnership;