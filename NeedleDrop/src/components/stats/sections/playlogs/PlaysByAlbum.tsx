import {Container, Grid, Typography} from "@mui/material"

import type { Stats } from "@interfaces/Stats"
import StatsAccordion from "@components/stats/StatsAccordion"

const PlaysByAlbum = ({stats, expanded, onToggle}: {stats: Stats, expanded: boolean, onToggle: (expanded: boolean) => void}) => {
  return (
    <StatsAccordion title="Plays By Albums" expanded={expanded} onChange={(_, isExpanded) => onToggle(isExpanded)}>
      <Container sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container direction="column" spacing={1}>
          {/* Header row */}
          <Grid container direction="row" key="header" justifyContent="space-between">
            <Grid>
              <Typography fontWeight="bold">Album</Typography>
            </Grid>
            <Grid>
              <Typography fontWeight="bold">Count</Typography>
            </Grid>
          </Grid>

          {Object.entries(stats.playsByAlbum)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)
            .map((item) => (
              <Grid container direction="row" key={item.name} justifyContent="space-between">
                <Grid size="grow">
                  <Typography
                    sx={{
                      wordBreak: "break-word",
                      whiteSpace: "normal"
                    }}
                  >
                    {item.name}
                  </Typography>
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

export default PlaysByAlbum
