import { Box, Grid, Typography } from "@mui/material";

import type { Vinyl } from "@interfaces/Vinyl";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const AlbumsStats = () => {
  const {isLoading: isUserLoading, user} = useAuthenticationContext();
  const {isLoading: isVinylsLoading, vinyls, getVinylsOwnedByUserId, getVinylsBoughtByUserId, calculateTotalPrice, calculateValueById, calculateTotalSpentById} = useVinylContext();

  if (isUserLoading || isVinylsLoading)
  {
    return <div>Loading</div>
  }

  if (!user) return;

  const ownedList: Vinyl[] = getVinylsOwnedByUserId(user.id);
  const collectionValue = calculateValueById(user.id);

  const boughtList: Vinyl[] = getVinylsBoughtByUserId(user.id);
  const totalSpent: number = calculateTotalSpentById(user.id);

  const totalCostHousehold = calculateTotalPrice();

  return (
    <Box paddingBottom={2}>
      <Grid>
        <Typography variant="h5">Vinyl stats</Typography>
      </Grid>
      <Grid container direction="column" spacing={1}>
        <Grid>
          <Typography>Total Records owned by you: {ownedList.length}</Typography>
        </Grid>
        <Grid>
          <Typography>Total Value: ${Number(collectionValue).toFixed(2)}</Typography>
        </Grid>
      </Grid>

      <Grid container direction="column" spacing={1}>
        <Grid>
          <Typography>Total Records bought by you: {boughtList.length}</Typography>
        </Grid>
        <Grid>
          <Typography>Total Value: ${Number(totalSpent).toFixed(2)}</Typography>
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
