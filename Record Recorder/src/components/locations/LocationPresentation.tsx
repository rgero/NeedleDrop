import { Box, Button, FormLabel, Grid, MenuItem, Select, TextField } from "@mui/material";
import { useEffect, useState } from "react";

import { APIProvider } from "@vis.gl/react-google-maps";
import { AddressSearchMap } from "./AddressSearchMap";
import type { Location } from "@interfaces/Location";
import toast from "react-hot-toast";
import { useLocationContext } from "@context/location/LocationContext";
import { useParams } from "react-router-dom";

const LocationPresentation = () => {
  const { id } = useParams();
  const [inEdit, setIsInEdit] = useState<boolean>(false);
  const [formData, setFormData] = useState<Location | null>(null);
  const { isLoading, getLocationById, updateLocation } = useLocationContext();

  const currentLocation = getLocationById(Number(id));

  useEffect(() => {
    if (currentLocation) setFormData(currentLocation);
  }, [currentLocation]);

  if (isLoading || !formData) return <div>Loading...</div>;

  const handleAddressChange = (address: string, lat: number, lng: number) => {
    setFormData((prev) => (prev ? { 
        ...prev, 
        address: address,
        // Assuming your interface might have these, otherwise they are just available here
        lat: lat, 
        lng: lng 
    } : null));
  };

  const handleSave = () => {
    try {
      updateLocation(Number(id), formData);
      setIsInEdit(false);
      toast.success("Location updated successfully!");
    } catch (error) {
      toast.error("Failed to update location.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setFormData(currentLocation);
    setIsInEdit(false);
  };

  return (
    <APIProvider apiKey={import.meta.env.VITE_GOOGLE_LOCATIONS_API} libraries={['places', 'marker']}>
      <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3, pb: 10 }}>
        <Grid container spacing={3}>
          {/* Name Field */}
          <Grid size={12}>
            <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Name</FormLabel>
            <TextField
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
              disabled={!inEdit}
            />
          </Grid>

          {/* Address & Map Section */}
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
    </APIProvider>
  );
};

export default LocationPresentation;