import { Box, Grid, Paper, Typography } from "@mui/material";

import type { Location } from "@interfaces/Location"
import type { Vinyl } from "@interfaces/Vinyl";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const LocationTable = () => {
  const {isLoading: isUserLoading, user} = useAuthenticationContext();
  const {isLoading: isVinylsLoading, getVinylsOwnedByUserId} = useVinylContext();

  if (isUserLoading || isVinylsLoading)
  {
    return <div>Loading</div>
  }

  if (!user) return;

  const vinylList: Vinyl[] = getVinylsOwnedByUserId(user.id);
  const sortedLocations = (() => {
    const counts = new Map<Location, number>();

    for (const vinyl of vinylList) {
      const location = vinyl.purchaseLocation;
      if (!location) continue;

      counts.set(location, (counts.get(location) ?? 0) + 1);
    }

    return Array.from(counts.entries())
      .map(([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count); // descending
  })();


  return (
    <Box >
      <Typography variant="h5">Location Stats</Typography>
      <Typography variant="h6">Stores by Purchase Count</Typography>
      <Grid container direction="column">
        <Grid container direction="row" size={12}>
          <Grid size={5}>
            <Typography>Name</Typography>
          </Grid>
          <Grid>
            <Typography>Count</Typography>
          </Grid>
        </Grid>
        {sortedLocations.slice(0,5).map( (item) => (
          <Grid container direction="row" size={12}>
            <Grid size={5}>
              <Typography>{item.location.name}</Typography>
            </Grid>
            <Grid>
              <Typography>{item.count}</Typography>
            </Grid>
          </Grid>
        ))}
      </Grid>
      
    </Box>
  )
}

export default LocationTable
