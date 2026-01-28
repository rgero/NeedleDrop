import { Container, Grid, Typography } from "@mui/material"

import type { Stats } from "@interfaces/Stats";

const LocationStats = ({stats} : {stats: Stats}) => {
  return (
    <Container>
      <Typography variant="h6">Locations</Typography>
      <Container sx={{width: {sm: "80%", lg:"50%"}}}>
        <Grid container direction="column" spacing={1}>
          {/* Header row */}
          <Grid container direction="row" key="header" justifyContent="space-between">
            <Grid>
              <Typography>Name</Typography>
            </Grid>
            <Grid>
              <Typography>Count</Typography>
            </Grid>
          </Grid>

          {Object.entries(stats.topLocations)
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

export default LocationStats
