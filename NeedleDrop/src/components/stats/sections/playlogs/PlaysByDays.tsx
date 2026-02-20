import {Container, Grid, Typography} from "@mui/material"

import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/StatsAccordion"

const PlaysByDays = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion title="Plays By Days" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Container disableGutters sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container direction="column" spacing={1}>
          <Grid container direction="row" key="header" justifyContent="space-between">
            <Grid>
              <Typography fontWeight="bold">Day</Typography>
            </Grid>
            <Grid>
              <Typography fontWeight="bold">Count</Typography>
            </Grid>
          </Grid>

          {Object.entries(stats.playsByDays)
            .map(([name, count]) => ({ name, count }))
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

export default PlaysByDays
