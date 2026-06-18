import {Container, Grid, Typography} from "@mui/material"

import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/ui/StatsAccordion"

const PlaysByDays = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion title="Plays By Days" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Container disableGutters sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container spacing={1} sx={{flexDirection: "column"}}>
          <Grid container key="header" sx={{
            justifyContent: "space-between",
            flexDirection: "row",
          }}>
            <Grid>
              <Typography sx={{
                fontWeight: "bold"
              }}>Day</Typography>
            </Grid>
            <Grid>
              <Typography sx={{
                fontWeight: "bold"
              }}>Count</Typography>
            </Grid>
          </Grid>

          {Object.entries(stats.playsByDays)
            .map(([name, count]) => ({ name, count }))
            .map((item) => (
              <Grid container key={item.name} sx={{
                justifyContent: "space-between",
                flexDirection: "row",
              }}>
                <Grid>
                  <Typography>{item.name}</Typography>
                </Grid>
                <Grid>
                  <Typography>{item.count}</Typography>
                </Grid>
              </Grid>
            ))}
        </Grid>
      </Container>
    </StatsAccordion>
  );
}

export default PlaysByDays
