import { Box, Container, Grid, Typography } from "@mui/material"

import { RoundNumber } from "@utils/RoundNumber"
import type { Stats } from "@interfaces/Stats"

const PlaylogStats = ({stats}: {stats: Stats}) => {
  return (
    <Box>
      <Typography variant="h6">Play Stats</Typography>
      <Container sx={{width: "50%"}}>
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
    </Box>
  )
}

export default PlaylogStats
