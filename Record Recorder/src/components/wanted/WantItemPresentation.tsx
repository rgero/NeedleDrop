import { Button, FormLabel, Grid, TextField } from "@mui/material";

import type { WantedItem } from "@interfaces/WantedItem";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const WantItemPresentation = () => {
  const {id} = useParams();
  const {isLoading, getWantedItemById} = useWantedItemContext();
  const [inEdit, setIsInEdit] = useState<boolean>(false);

  if (isLoading) return <div>Loading...</div>

  const wantedItem: WantedItem|null = getWantedItemById(Number(id));

  if (!wantedItem) return <div>Wanted Item not found</div>

  return (
    <Grid container direction="column" justifyContent="center" alignItems="center" spacing={3}>
      <Grid>
        <FormLabel>Artist</FormLabel>
        <TextField
          value={wantedItem?.artist}
          variant="outlined"
          fullWidth
          disabled={!inEdit}
        />
      </Grid>
      <Grid>
        <FormLabel>Album</FormLabel>
        <TextField
          value={wantedItem?.album}
          variant="outlined"
          fullWidth
          disabled={!inEdit}
        />
      </Grid>
      <Grid>
        <FormLabel>Album Art</FormLabel>
        <Grid>
          <img src={wantedItem?.imageUrl} alt={`${wantedItem?.artist} - ${wantedItem?.album}`} height="300" width="300" />
        </Grid>
      </Grid>
      <Grid>
        <FormLabel>Searcher(s)</FormLabel>
        <TextField
          value={wantedItem?.searcher.map((user) => user.name).join(", ")}
          variant="outlined"
          fullWidth
          disabled={!inEdit}
        />
      </Grid>
      <Grid>
        <FormLabel>Notes</FormLabel>
        <TextField
          value={wantedItem?.notes}
          variant="outlined"
          fullWidth
          disabled={!inEdit}
          multiline
          rows={4}
        />
      </Grid>
      <Grid>
        <Button variant="contained" onClick={() => setIsInEdit(!inEdit)}>
          {inEdit ? "Save" : "Edit"}
        </Button>
      </Grid>
    </Grid>
  )
}

export default WantItemPresentation
