import { Container, Grid, Typography } from "@mui/material"

import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/StatsAccordion"

const TopPlayDates = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion title="Top Play Days" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Container disableGutters sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container direction="column" spacing={1}>
          <Grid container direction="row" key="header" justifyContent="space-between">
            <Grid>
              <Typography fontWeight="bold">Date</Typography>
            </Grid>
            <Grid>
              <Typography fontWeight="bold">Count</Typography>
            </Grid>
          </Grid>

          {Object.entries(stats.topPlayDays)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((item) => (
              <Grid container direction="row" key={item.name} justifyContent="space-between">
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
  )
}

export default TopPlayDates
