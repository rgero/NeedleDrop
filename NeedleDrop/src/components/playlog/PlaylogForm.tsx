import { Autocomplete, Box, Button, FormLabel, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import FloatingAction from "@components/ui/FloatingAction";
import FormHeader from "@components/ui/FormHeader";
import type { PlayLog } from "@interfaces/PlayLog";
import { format } from 'date-fns';
import toast from "react-hot-toast";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useUserContext } from "@context/users/UserContext";
import { useVinylContext } from "@context/vinyl/VinylContext";

const emptyPlaylog: Partial<PlayLog> = {
  album_id: null as unknown as number, 
  listeners: [],
  date: new Date(),
};

const PlaylogForm = () => {
  const { id } = useParams();
  const { openDeleteDialog } = useDialogProvider();
  const { isLoading, getPlaylogById, updatePlaylog, createPlaylog, deletePlaylog } = usePlaylogContext();
  const { isLoading: isVinylLoading, vinyls = [] } = useVinylContext();
  const { isLoading: usersLoading, users = [] } = useUserContext();
  const navigate = useNavigate();

  const isCreateMode = !id || id === 'new';

  const [inEdit, setIsInEdit] = useState<boolean>(isCreateMode);
  const [formData, setFormData] = useState(isCreateMode ? emptyPlaylog : null);

  const currentPlaylog = !isCreateMode ? getPlaylogById(Number(id)) : null;

  useEffect(() => {
    if (!isCreateMode && currentPlaylog && !formData) {
      setFormData(currentPlaylog);
    }
  }, [currentPlaylog, isCreateMode, formData]);

  // Find the full vinyl object based on the album_id in formData
  const selectedVinyl = useMemo(() => {
    if (!formData?.album_id) return null;
    return vinyls.find((v) => v.id === formData.album_id) || null;
  }, [vinyls, formData?.album_id]);

  if (isVinylLoading) return <Typography sx={{ p: 4 }}>Loading collection...</Typography>;
  if (!isCreateMode && (isLoading || usersLoading || !formData)) return <Typography sx={{ p: 4 }}>Loading playlog...</Typography>;
  if (!formData) return null;

  const handleSave = async () => {
    if (!formData.album_id) {
      toast.error("You must select a vinyl from the list.");
      return;
    }

    const payload = {...formData, album_id: formData.album_id as number} as PlayLog;
    try {
      if (isCreateMode) {
        await createPlaylog(payload); // No more TS error
        toast.success("Playlog created successfully!");
        navigate(`/plays`);
      } else {
        await updatePlaylog(Number(id), payload);
        setIsInEdit(false);
        toast.success("Playlog updated successfully!");
      }
    } catch (error) {
      toast.error(`Failed to save playlog.`);
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePlaylog(Number(id));
      toast.success("Playlog deleted.");
      navigate("/plays");
    } catch (error) {
      toast.error("Failed to delete playlog.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    if (isCreateMode) {
      navigate(-1);
    } else {
      setFormData(currentPlaylog);
      setIsInEdit(false);
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto', p: 3, pb: 10 }}>
      <FormHeader isCreateMode={isCreateMode} />
      <Grid container spacing={3}>
        
        {/* Unified Vinyl Autocomplete */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Vinyl Record</FormLabel>
          <Autocomplete
            disabled={!inEdit}
            options={vinyls}
            getOptionLabel={(option) => `${option.artist} - ${option.album}`}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={selectedVinyl}
            onChange={(_event, newValue) => {
              setFormData({ 
                ...formData, 
                album_id: newValue ? newValue.id : null,
              });
            }}
            renderInput={(params) => (
              <TextField 
                {...params} 
                placeholder="Search by artist or album..." 
                fullWidth 
                error={inEdit && !formData.album_id}
                helperText={inEdit && !formData.album_id ? "Selection required" : ""}
              />
            )}
          />
        </Grid>

        {/* Multi-Select Listeners */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Listener(s)</FormLabel>
          <Autocomplete
            multiple
            disabled={!inEdit}
            options={users}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={formData.listeners || []}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, listeners: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder={inEdit && formData.listeners?.length === 0 ? "Select Listeners" : ""} />
            )}
          />
        </Grid>

        {/* Date Field */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Date</FormLabel>
          <TextField
            type="date"
            value={formData.date ? format(new Date(formData.date), 'yyyy-MM-dd') : ""}
            onChange={(e) => {
              const selectedDate = new Date(e.target.value + 'T00:00:00');
              setFormData({ ...formData, date: selectedDate });
            }}
            fullWidth
            disabled={!inEdit}
          />
        </Grid>

        {/* Action Buttons */}
        <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          {inEdit ? (
            <>
              <Button variant="outlined" size="large" onClick={handleCancel}>Cancel</Button>
              {!isCreateMode && (
                <Button 
                  variant="contained" 
                  size="large" 
                  onClick={() => openDeleteDialog({
                    name: `${selectedVinyl?.artist || 'Unknown'} - ${selectedVinyl?.album || 'Unknown'}`, 
                    type: "Playlog"
                  }, handleConfirmDelete)} 
                  color="error"
                >
                  Delete
                </Button>
              )}
              <Button 
                variant="contained" 
                size="large" 
                onClick={handleSave} 
                color="success"
                // Disable button if album_id is missing
                disabled={!formData.album_id}
              >
                {isCreateMode ? "Create" : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button variant="contained" size="large" onClick={() => setIsInEdit(true)}>Edit</Button>
          )}
        </Grid>
      </Grid>
      <FloatingAction slug="plays" />
    </Box>
  );
};

export default PlaylogForm;