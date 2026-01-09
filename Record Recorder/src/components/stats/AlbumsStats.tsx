import { Grid, Typography } from "@mui/material";

import type { Location } from "@interfaces/Location";
import type { Vinyl } from "@interfaces/Vinyl";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const AlbumsStats = () => {
  const {isLoading: isUserLoading, user} = useAuthenticationContext();
  const {isLoading: isVinylsLoading, getVinylsOwnedByUserId, calculateTotalPriceByUserId} = useVinylContext();

  if (isUserLoading || isVinylsLoading)
  {
    return <div>Loading</div>
  }

  if (!user) return;

  const vinylList: Vinyl[] = getVinylsOwnedByUserId(user.id);
  const totalCost = calculateTotalPriceByUserId(user.id);

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
    <Grid container direction="column">
      <Grid>
        <Typography variant="h6">Vinyl stats</Typography>
      </Grid>
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
  )
}

export default AlbumsStats
