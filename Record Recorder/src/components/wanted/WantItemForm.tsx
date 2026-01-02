import { Autocomplete, Box, Button, Chip, FormLabel, Grid, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AlbumImagePresenter from "@components/ui/AlbumImagePresenter";
import type { WantedItem } from "@interfaces/WantedItem";
import toast from "react-hot-toast";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { useUserContext } from "@context/users/UserContext";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

const emptyWant : WantedItem = {
  artist: "",
  album: "",
  searcher: [],
  notes: "",
  imageUrl: "",
}


const WantItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openDeleteDialog } = useDialogProvider();
  const { isLoading: usersLoading, users} = useUserContext();
  const { isLoading, getWantedItemById, updateWantedItem, createWantedItem, deleteWantedItem } = useWantedItemContext();
  
  const isCreateMode = !id || id === 'new';

  const [inEdit, setIsInEdit] = useState<boolean>(isCreateMode);
  const [formData, setFormData] = useState<WantedItem | null>(isCreateMode ? emptyWant : null);

  const wantedItem = getWantedItemById(Number(id));

  useEffect(() => {
    if (wantedItem) setFormData(wantedItem);
  }, [wantedItem]);

  if (isLoading || usersLoading || !formData) return <div>Loading...</div>;

  const handleSave = async () => {
    try {
      if (isCreateMode) {
        await createWantedItem(formData);
        toast.success("Wanted Item created successfully!");
        navigate(`/wantlist`);
      } else {
        await updateWantedItem(Number(id), formData);
        setIsInEdit(false);
        toast.success("Wanted Item updated successfully!");
      }
    } catch (error) {
      toast.error(`Failed to ${isCreateMode ? 'create' : 'update'} wanteditem.`);
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteWantedItem(Number(id));
      toast.success("Wanted item deleted.");
      navigate("/wantlist");
    } catch (error) {
      toast.error("Failed to delete wanted item.");
      console.error(error);
    }
  };
  
  const handleCancel = () => {
    if (isCreateMode) {
      navigate(-1);
    } else {
      setFormData(wantedItem);
      setIsInEdit(false);
    }
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
          <AlbumImagePresenter 
            targetURL={formData.imageUrl} 
            altText={`${formData.artist} - ${formData.album}`}
            onImageChange={(newUrl) => setFormData({ ...formData, imageUrl: newUrl })}
            editable={inEdit} // Pass the form's edit state here
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
              <Button variant="outlined" size="large" onClick={handleCancel}>
                Cancel
              </Button>
              
              {!isCreateMode && (
                <Button variant="contained" size="large" onClick={() => openDeleteDialog({name: `${formData.artist} - ${formData.album}`, type: "Want Item"}, handleConfirmDelete)} color="error">
                  Delete
                </Button>
              )}

              <Button variant="contained" size="large" onClick={handleSave} color="success">
                {isCreateMode ? "Create" : "Save Changes"}
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

export default WantItemForm;