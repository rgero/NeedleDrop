import { Grid, Typography } from "@mui/material";

import type { Location } from "@interfaces/Location";
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

  const mostPopulatedLocation = (() => {
    const counts = new Map<Location, number>();

    for (const vinyl of vinylList) {
      const location = vinyl.purchaseLocation;
      if (!location) continue;

      counts.set(location, (counts.get(location) ?? 0) + 1);
    }

    let result: { location: Location; count: number } | null = null;

    for (const [location, count] of counts) {
      if (!result || count > result.count) {
        result = { location, count };
      }
    }

    return result;
  })();

  return (
    <Grid container direction="column" spacing={3}>

      <Grid>
        <Typography variant="h6">Vinyl stats</Typography>
      </Grid>
      <Grid container direction="column" spacing={1}>
        <Grid>
          <Typography>Total Records owned by you: {vinylList.length}</Typography>
        </Grid>
        <Grid>
          <Typography>Total Cost: ${totalCost}</Typography>
        </Grid>
        <Grid>
          <Typography>Your favorite store: {mostPopulatedLocation?.location.name} - {mostPopulatedLocation?.count}</Typography>
        </Grid>
      </Grid>
      <Grid container direction="column" spacing={1}>
        <Grid><Typography variant="h6">House Hold Stats</Typography></Grid>
        <Grid><Typography>Total Cost ${totalCostHousehold}</Typography></Grid>
        <Grid><Typography>Total Vinyl: {vinyls.length}</Typography></Grid>
      </Grid>
    </Grid>
  )
}

export default AlbumsStats
