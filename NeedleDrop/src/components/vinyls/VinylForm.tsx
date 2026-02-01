import { Autocomplete, Box, Button, Checkbox, Chip, FormLabel, Grid, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import AlbumImagePresenter from "@components/ui/AlbumImagePresenter";
import FloatingAction from "@components/ui/FloatingAction";
import FormHeader from "@components/ui/FormHeader";
import type { Vinyl } from "@interfaces/Vinyl"
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { useLocationContext } from "@context/location/LocationContext";
import { useUserContext } from "@context/users/UserContext";
import { useVinylContext } from "@context/vinyl/VinylContext";
import { useWantedItemContext } from "@context/wanted/WantedItemContext";

interface VinylFormData extends Vinyl {
  wantedID?: number;
}

const emptyVinyl: VinylFormData = {
  artist: "",
  album: "",
  color: "",
  price: 0,
  purchaseDate: new Date(),
  purchaseLocation: null,
  purchasedBy: [],
  owners: [],
  notes: "",
  length: 0,
  likedBy: [],
  imageUrl: "",
  doubleLP: false
};

const VinylForm = () => {
  const { id } = useParams();
  const { openDeleteDialog } = useDialogProvider();
  const { isLoading, getVinylById, updateVinyl, createVinyl, deleteVinyl } = useVinylContext();
  const { isLoading: locationsLoading, locations } = useLocationContext();
  const { isLoading: usersLoading, users } = useUserContext();
  const { deleteWantedItem } = useWantedItemContext();
  const navigate = useNavigate();
  const location = useLocation();

  const isCreateMode = !id || id === 'new';

  const [inEdit, setIsInEdit] = useState<boolean>(isCreateMode);
  const [formData, setFormData] = useState<VinylFormData | null>(() => {
    if (isCreateMode) {
      // Cast location.state to help TS understand the incoming data
      const state = location.state as { fromWantItem?: Partial<VinylFormData> } | null;
      const transferredData = state?.fromWantItem;
      return { ...emptyVinyl, ...transferredData };
    }
    return null;
  });
  
  const [deleteFromWanted, setDeleteFromWanted] = useState<boolean>(false);

  const currentVinyl = !isCreateMode ? getVinylById(Number(id)) : null;

  useEffect(() => {
    if (!isCreateMode && currentVinyl && !formData) {
      setFormData(currentVinyl);
    }
  }, [currentVinyl, isCreateMode, formData]);

  if (!isCreateMode && (isLoading || usersLoading || locationsLoading || !formData)) {
    return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  }
  
  if (!formData) return null;

  const handleSave = async () => {
    try {
      const { wantedID, ...vinylData } = formData;
      if (isCreateMode) {
        await createVinyl(vinylData);
        if (deleteFromWanted && wantedID) {
          await deleteWantedItem(wantedID);
        }
        toast.success("Vinyl created successfully!");
        navigate(`/vinyls`);
      } else {
        await updateVinyl(Number(id), vinylData);
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
      <FormHeader isCreateMode={isCreateMode} />
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

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Album Art</FormLabel>
          <AlbumImagePresenter 
            targetURL={formData.imageUrl} 
            altText={`${formData.artist} - ${formData.album}`}
            onImageChange={(newUrl) => setFormData({ ...formData, imageUrl: newUrl })}
            editable={inEdit} // Pass the form's edit state here
          />
        </Grid>        

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Color</FormLabel>
          <TextField
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            fullWidth
            disabled={!inEdit}
            placeholder="Enter album color"
          />
        </Grid>

        <Grid size={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <FormLabel
            htmlFor="double-lp-checkbox"
            sx={{ fontWeight: 'bold', cursor: inEdit ? 'pointer' : 'default' }}
          >
            Is Double LP?
          </FormLabel>
          <Checkbox
            id="double-lp-checkbox"
            checked={formData.doubleLP}
            disabled={!inEdit}
            onChange={(e) => setFormData({ ...formData, doubleLP: e.target.checked })}
            sx={{ pr: 0 }}
          />
        </Grid>

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
            value={formData.length || ''}
            onChange={(e) => setFormData({ ...formData, length: e.target.value ? Number(e.target.value) : 0 })}
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
            onChange={(e) => setFormData({ ...formData, price: e.target.value ? Number(e.target.value) : 0 })}
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
            value={formData.purchaseLocation ? formData.purchaseLocation.id : ""}
            onChange={(e) => setFormData({ ...formData, purchaseLocation: locations.find(l => l.id === Number(e.target.value)) ?? null })}
            fullWidth
            disabled={!inEdit}
          >
            {[...locations].sort((a, b) => a.name.localeCompare(b.name)).map((location) => (
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
            value={formData.purchaseDate ? format(formData.purchaseDate, 'yyyy-MM-dd') : ""}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value + 'T00:00:00');
              setFormData({ ...formData, purchaseDate: selectedDate });
            }}
            fullWidth
            disabled={!inEdit}
            slotProps={{
              inputLabel: { shrink: true }
            }}
          />
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Purchased By</FormLabel>
          <Autocomplete
            multiple
            disabled={!inEdit}
            options={users}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={formData.purchasedBy}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, purchasedBy: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder={inEdit ? "Select Buyer" : ""} />
            )}
            renderValue={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
              ))
            }
          />
        </Grid>

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

        {/* Conditional Field: Only shown if vinyl was transferred from a "Wanted" item */}
        {formData.wantedID && (
          <Grid size={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <FormLabel
              htmlFor="delete-from-wanted-checkbox"
              sx={{ fontWeight: 'bold', cursor: inEdit ? 'pointer' : 'default' }}
            >
              Delete from Wanted list?
            </FormLabel>
            <Checkbox
              id="delete-from-wanted-checkbox"
              checked={deleteFromWanted}
              disabled={!inEdit}
              onChange={(e) => setDeleteFromWanted(e.target.checked)}
            />
          </Grid>
        )}

        <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          {inEdit ? (
            <>
              <Button variant="outlined" size="large" onClick={handleCancel}>
                Cancel
              </Button>

              {!isCreateMode && (
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => openDeleteDialog({ name: `${formData.artist} - ${formData.album}`, type: "Vinyl" }, handleConfirmDelete)} 
                  color="error"
                >
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
      <FloatingAction slug="vinyls" />
    </Box>
  );
};

export default VinylForm;