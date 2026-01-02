import {Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormLabel, Grid, MenuItem, Select, TextField, Typography} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { APIProvider } from "@vis.gl/react-google-maps";
import { AddressSearchMap } from "./AddressSearchMap";
import type { Location } from "@interfaces/Location";
import toast from "react-hot-toast";
import { useLocationContext } from "@context/location/LocationContext";

const emptyLocation: Location = {
  name: "",
  address: "",
  recommended: null,
  notes: "",
};

const LocationPresentation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Mode detection
  const isCreateMode = !id || id === 'new';

  const [inEdit, setIsInEdit] = useState<boolean>(isCreateMode);
  const [formData, setFormData] = useState<Location | null>(isCreateMode ? emptyLocation : null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  
  const {isLoading, getLocationById, updateLocation, createLocation, deleteLocation} = useLocationContext();

  const currentLocation = !isCreateMode ? getLocationById(Number(id)) : null;

  // Sync form data when existing location is loaded
  useEffect(() => {
    if (!isCreateMode && currentLocation) {
      setFormData(currentLocation);
    }
  }, [currentLocation, isCreateMode]);

  if (!isCreateMode && (isLoading || !formData)) return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  if (!formData) return null;

  const handleAddressChange = (address: string) => {
    setFormData((prev) => (prev ? { 
        ...prev, 
        address
    } : null));
  };

  const handleSave = async () => {
    try {
      if (isCreateMode) {
        await createLocation(formData);
        toast.success("Location created successfully!");
        navigate(`/locations`); // Navigate back to list
      } else {
        await updateLocation(Number(id), formData);
        setIsInEdit(false);
        toast.success("Location updated successfully!");
      }
    } catch (error) {
      toast.error(`Failed to ${isCreateMode ? 'create' : 'update'} location.`);
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteLocation(Number(id));
      setIsDeleteDialogOpen(false);
      toast.success("Location deleted.");
      navigate("/locations");
    } catch (error) {
      toast.error("Failed to delete location.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate(-1);
    } else {
      setFormData(currentLocation);
      setIsInEdit(false);
    }
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_LOCATIONS_API} libraries={['places', 'marker']}>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3, pb: 10 }}>
        <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
            {isCreateMode ? "Add New Location" : "Location Details"}
        </Typography>

        <Grid container spacing={3}>
          {/* Name Field */}
          <Grid size={12}>
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Name</FormLabel>
            <TextField
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              disabled={!inEdit}
              placeholder="Enter location name"
            />
          </Grid>

          <Grid size={12}>
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Address</FormLabel>
            <AddressSearchMap 
                initialAddress={formData.address} 
                onAddressSelect={handleAddressChange} 
                disabled={!inEdit}
            />
          </Grid>

          {/* Recommended Field */}
          <Grid size={12}>
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Recommended</FormLabel>
            <Select
              value={formData.recommended === null ? "---" : (formData.recommended ? "Yes" : "No")}
              onChange={(e) => {
                const val = e.target.value;
                setFormData({ 
                  ...formData, 
                  recommended: val === "Yes" ? true : val === "No" ? false : null 
                });
              }}
              fullWidth
              disabled={!inEdit}
            >
              <MenuItem value="Yes">Yes</MenuItem>
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="---">---</MenuItem>
            </Select>
          </Grid>

          {/* Notes Field */}
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

          <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
            {inEdit ? (
              <>
                <Button variant="outlined" size="large" onClick={handleCancel}>
                  Cancel
                </Button>
                
                {!isCreateMode && (
                  <Button variant="contained" size="large" onClick={() => setIsDeleteDialogOpen(true)} color="error">
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

        {/* Delete Confirmation Dialog */}
        <Dialog 
            open={isDeleteDialogOpen} 
            onClose={() => setIsDeleteDialogOpen(false)}
            aria-labelledby="delete-dialog-title"
        >
          <DialogTitle id="delete-dialog-title">Delete Location?</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete <strong>{formData.name}</strong>? 
              This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">
              Delete Permanently
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </APIProvider>
  );
};

export default LocationPresentation;