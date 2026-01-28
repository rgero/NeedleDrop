import { Container, Grid, Typography } from "@mui/material"

import { RoundNumber } from "@utils/RoundNumber"
import type { Stats } from "@interfaces/Stats"

const PlaylogStats = ({stats}: {stats: Stats}) => {
  return (
    <Container>
      <Typography variant="h6">Play Stats</Typography>
      <Container sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container direction="column" spacing={3}>
          <Grid container direction="column" spacing={1}>
            <Grid container justifyContent="space-between">
              <Grid>
                Total Plays
              </Grid>
              <Grid>
                {stats.totalPlays}
              </Grid>
            </Grid>
            <Grid container justifyContent="space-between">
              <Grid>
                Cost Per Play
              </Grid>
              <Grid>
                ${RoundNumber(stats.pricePaid/stats.totalPlays)}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <Typography variant="h6">Top Play Days</Typography>
      <Container sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container direction="column" spacing={1}>
          {/* Header row */}
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
    </Container>
  )
}

export default PlaylogStats
