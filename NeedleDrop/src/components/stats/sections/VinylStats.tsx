import { Box, Container, Grid, Typography } from "@mui/material"

import type { Stats } from "@interfaces/Stats";

const VinylStats = ({stats} : {stats: Stats}) => {
  return (
    <Container>
      <Box sx={{mb:2}}>
        <Typography variant="h6">Vinyls</Typography>
        <Container sx={{width: {sm: "80%", lg:"50%"}}}>
          <Grid container direction="column" spacing={3}>
            <Grid container direction="column" spacing={1}>
              <Grid container justifyContent="space-between">
                <Grid>
                  Total Records Owned
                </Grid>
                <Grid>
                  {stats.totalOwned}
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between">
                <Grid>
                  Collection Value
                </Grid>
                <Grid>
                  ${Number(stats.collectionValue).toFixed(2)}
                </Grid>
              </Grid>
            </Grid>

            <Grid container direction="column" spacing={1}>
              <Grid container justifyContent="space-between">
                <Grid>
                  Total Records Bought
                </Grid>
                <Grid>
                  {stats.totalBought}
                </Grid>
              </Grid>
              <Grid container justifyContent="space-between">
                <Grid>
                  Total Spent
                </Grid>
                <Grid>
                  ${Number(stats.pricePaid).toFixed(2)}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box>
        <Typography variant="h6">Top Artists</Typography>
        <Container sx={{width: {sm: "80%", lg:"50%"}}}>
          <Grid container direction="column" spacing={1}>
            {/* Header row */}
            <Grid container direction="row" key="header" justifyContent="space-between">
              <Grid>
                <Typography fontWeight="bold">Name</Typography>
              </Grid>
              <Grid>
                <Typography fontWeight="bold">Count</Typography>
              </Grid>
            </Grid>

            {Object.entries(stats.topArtists)
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
      </Box>

    </Container>
  )
}

export default VinylStats
