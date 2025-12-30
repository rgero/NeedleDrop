import { Autocomplete, Box, Button, Chip, FormLabel, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import type { WantedItem } from "@interfaces/WantedItem";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import { useUserContext } from "@context/users/UserContext";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const WantItemPresentation = () => {
  const { id } = useParams();
  const { isLoading: usersLoading, users} = useUserContext();
  const { isLoading, getWantedItemById, updatedWantedItem } = useWantedItemContext();
  

  const [inEdit, setIsInEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<WantedItem | null>(null);

  const wantedItem = getWantedItemById(Number(id));

  useEffect(() => {
    if (wantedItem) setFormData(wantedItem);
  }, [wantedItem]);

  if (isLoading || usersLoading || !formData) return <div>Loading...</div>;

  const handleSave = () => {
    try {
      updatedWantedItem(Number(id), formData);
      setIsInEdit(false);

      toast.success("Wanted item updated successfully!");
    } catch (error) {
      toast.error("Failed to update wanted item.");
      console.error(error);
    }

  };

  const handleCancel = () => {
    setFormData(wantedItem); // Reset to original data
    setIsInEdit(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3, pb: 10 }}>
      <Grid container spacing={3}>
        
        {/* Artist Field */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Artist</FormLabel>
          <TextField
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            fullWidth
            disabled={!inEdit}
          />
        </Grid>

        {/* Album Field */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Album</FormLabel>
          <TextField
            value={formData.album}
            onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            fullWidth
            disabled={!inEdit}
          />
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Album Art</FormLabel>
           <Box component="img" src={wantedItem?.imageUrl} alt={`${wantedItem?.artist} - ${wantedItem?.album}`}
              sx={{
                height: 300,
                width: 300,
                objectFit: 'cover',
                borderRadius: 2,
                boxShadow: 3,
                display: 'block',
                mx: 'auto'
              }}
            /> 
        </Grid>

        {/* Multi-Select Searchers */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Searcher(s)</FormLabel>
          <Autocomplete
            multiple
            disabled={!inEdit}
            options={users}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={formData.searcher}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, searcher: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder={inEdit ? "Select Searchers" : ""} />
            )}
            renderValue={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
              ))
            }
          />
        </Grid>

        {/* Notes Field */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Notes</FormLabel>
          <TextField
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            fullWidth
            disabled={!inEdit}
            multiline
            rows={4}
          />
        </Grid>

        {/* Action Buttons */}
        <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          {inEdit ? (
            <>
              <Button variant="contained" size="large" onClick={handleSave} color="success">
                Save
              </Button>
              <Button variant="outlined" size="large" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          ) : (
            <Button variant="contained" size="large" onClick={() => setIsInEdit(true)}>
              Edit
            </Button>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default WantItemPresentation;