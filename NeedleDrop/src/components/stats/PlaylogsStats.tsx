import { Grid, Typography } from "@mui/material";

import { RoundNumber } from "@utils/RoundNumber";
import { useAuthenticationContext } from "@context/authentication/AuthenticationContext";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const PlaylogsStats = () => {
  const {isLoading: isUserLoading, user} = useAuthenticationContext();
  const {isLoading: isPlaylogLoading, getPlaylogsByUserId} = usePlaylogContext();
  const {isLoading: isVinylsLoading, calculateTotalPriceByUserId} = useVinylContext();

  if (isUserLoading || isPlaylogLoading || isVinylsLoading)
  {
    return <div>Loading</div>
  }
  if (!user) return;

  const playList = getPlaylogsByUserId(user.id);
  const total = calculateTotalPriceByUserId(user.id);
  if (playList.length === 0) return (<div>No logs found</div>)

  return (
    <Grid container direction="column">
      <Grid>
        <Typography variant="h5">Play Stats</Typography>
      </Grid>
      <Grid>
        <Typography>Total Plays - {playList.length}</Typography>
      </Grid>
      <Grid>
        <Typography>Cost per play: ${RoundNumber(total/playList.length)}</Typography>
      </Grid>
    </Grid>
  )
}

export default PlaylogsStats
