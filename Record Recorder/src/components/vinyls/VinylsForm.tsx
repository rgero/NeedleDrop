import { Autocomplete, Box, Button, Chip, FormLabel, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { Vinyl } from "@interfaces/Vinyl"
import toast from "react-hot-toast";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { useLocationContext } from "@context/location/LocationContext";
import { useUserContext } from "@context/users/UserContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const emptyVinyl: Vinyl = {
  artist: "",
  album: "",
  purchaseDate: new Date(),
  purchaseLocation: null,
  owners: [],
  notes: "",
  length: 0,
  likedBy: [],
};

const VinylsForm = () => {
  const {id} = useParams();
  const { openDeleteDialog } = useDialogProvider();
  const {isLoading, getVinylById, updateVinyl, createVinyl, deleteVinyl} = useVinylContext();
  const {isLoading: locationsLoading, locations} = useLocationContext();
  const { isLoading: usersLoading, users} = useUserContext();
  const navigate = useNavigate();

  const isCreateMode = !id || id === 'new';

  const [inEdit, setIsInEdit] = useState<boolean>(isCreateMode);
  const [formData, setFormData] = useState<Vinyl | null>(isCreateMode ? emptyVinyl : null);

  const currentVinyl = !isCreateMode ? getVinylById(Number(id)) : null;

  useEffect(() => {
    if (!isCreateMode && currentVinyl) {
      setFormData(currentVinyl);
    }
  }, [currentVinyl, isCreateMode]);

  if (!isCreateMode && (isLoading || usersLoading || locationsLoading || !formData)) return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  if (!formData) return null;

  const handleSave = async () => {
    try {
      if (isCreateMode) {
        await createVinyl(formData);
        toast.success("Vinyl created successfully!");
        navigate(`/vinyls`);
      } else {
        await updateVinyl(Number(id), formData);
        setIsInEdit(false);
        toast.success("Vinyl updated successfully!");
      }
    } catch (error) {
      toast.error(`Failed to ${isCreateMode ? 'create' : 'update'} vinyl.`);
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteVinyl(Number(id));
      toast.success("Vinyl deleted.");
      navigate("/vinyls");
    } catch (error) {
      toast.error("Failed to delete vinyl.");
      console.error(error);
    }
  };
  
  const handleCancel = () => {
    if (isCreateMode) {
      navigate(-1);
    } else {
      setFormData(currentVinyl);
      setIsInEdit(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3, pb: 10 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          {isCreateMode ? "Add New Vinyl" : "Vinyl Details"}
      </Typography>
      <Grid container spacing={3}>
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Artist</FormLabel>
          <TextField
            value={formData.artist}
            onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
            fullWidth
            disabled={!inEdit}
            placeholder="Enter artist name"
          />
        </Grid>
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Album</FormLabel>
          <TextField
            value={formData.album}
            onChange={(e) => setFormData({ ...formData, album: e.target.value })}
            fullWidth
            disabled={!inEdit}
            placeholder="Enter album name"
          />
        </Grid>

        {/* Multi-Select Owners */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Owner(s)</FormLabel>
          <Autocomplete
            multiple
            disabled={!inEdit}
            options={users}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={formData.owners}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, owners: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder={inEdit ? "Select owners" : ""} />
            )}
            renderValue={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
              ))
            }
          />
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Length (minutes)</FormLabel>
          <TextField
            type="number"
            value={formData.length}
            onChange={(e) => setFormData({ ...formData, length: Number(e.target.value) })}
            fullWidth
            disabled={!inEdit}
            placeholder="Enter length in minutes"
          />
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Price ($)</FormLabel>
          <TextField
            type="number"
            value={formData.price || ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : undefined })}
            fullWidth
            disabled={!inEdit}
            placeholder="Enter price"
          />
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Notes</FormLabel>
          <TextField
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            fullWidth
            multiline
            rows={4}
            disabled={!inEdit}
            placeholder="Add any specific details here..."
          />
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Purchase Location</FormLabel>
          <Select
            value={formData.purchaseLocation}
            onChange={(e) => setFormData({ ...formData, purchaseLocation: Number(e.target.value) })}
            fullWidth
            disabled={!inEdit}
          >
            {locations.map((location) => (
              <MenuItem key={location.id} value={location.id}>
                {location.name}
              </MenuItem>
            ))}
          </Select>
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Purchased Date</FormLabel>
          <TextField
            type="date"
            value={formData.purchaseDate ? formData.purchaseDate.toISOString().split('T')[0] : ""}
            onChange={(e) => setFormData({ ...formData, purchaseDate: new Date(e.target.value) })}
            fullWidth
            disabled={!inEdit}
          />
        </Grid>

        {/* Multi-Select Liked By */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Liked By</FormLabel>
          <Autocomplete
            multiple
            disabled={!inEdit}
            options={users}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={formData.likedBy}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, likedBy: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder={inEdit ? "Select liked by" : ""} />
            )}
            renderValue={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
              ))
            }
          />
        </Grid>

        <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          {inEdit ? (
            <>
              <Button variant="outlined" size="large" onClick={handleCancel}>
                Cancel
              </Button>
              
              {!isCreateMode && (
                <Button variant="contained" size="large" onClick={() => openDeleteDialog({name: `${formData.artist} - ${formData.album}`, type: "Vinyl"}, handleConfirmDelete)} color="error">
                  Delete
                </Button>
              )}

              <Button variant="contained" size="large" onClick={handleSave} color="success">
                {isCreateMode ? "Create Location" : "Save Changes"}
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
  )
}

export default VinylsForm
