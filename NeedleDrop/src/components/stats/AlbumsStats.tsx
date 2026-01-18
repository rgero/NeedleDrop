import { Box, Grid, Typography } from "@mui/material";

import type { Vinyl } from "@interfaces/Vinyl";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const AlbumsStats = () => {
  const {isLoading: isUserLoading, user} = useAuthenticationContext();
  const {isLoading: isVinylsLoading, vinyls, getVinylsOwnedByUserId, calculateTotalPrice, calculateTotalPriceByUserId} = useVinylContext();

  if (isUserLoading || isVinylsLoading)
  {
    return <div>Loading</div>
  }

  if (!user) return;

  const vinylList: Vinyl[] = getVinylsOwnedByUserId(user.id);
  const totalCost = calculateTotalPriceByUserId(user.id);

  const totalCostHousehold = calculateTotalPrice();

  return (
    <Box paddingBottom={2}>
      <Grid>
        <Typography variant="h5">Vinyl stats</Typography>
      </Grid>
      <Grid container direction="column" spacing={1}>
        <Grid>
          <Typography>Total Records owned by you: {vinylList.length}</Typography>
        </Grid>
        <Grid>
          <Typography>Total Cost: ${Number(totalCost).toFixed(2)}</Typography>
        </Grid>
      </Grid>
      <Typography variant="h5">House Hold Stats</Typography>
      <Grid container direction="column" spacing={1}>
        <Grid><Typography>Total Cost ${Number(totalCostHousehold).toFixed(2)}</Typography></Grid>
        <Grid><Typography>Total Vinyl: {vinyls.length}</Typography></Grid>
      </Grid>
    </Box>
  )
}

export default AlbumsStats
