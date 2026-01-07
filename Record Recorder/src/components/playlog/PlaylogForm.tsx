import { Autocomplete, Box, Button, Chip, FormLabel, Grid, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

import type { PlayLog } from "@interfaces/PlayLog";
import toast from "react-hot-toast";
import { useDialogProvider } from "@context/dialog/DialogContext";
import { usePlaylogContext } from "@context/playlogs/PlaylogContext";
import { useUserContext } from "@context/users/UserContext";

const emptyPlaylog : PlayLog = {
  artist: "",
  album: "",
  listeners: [],
  date: new Date(),
}


const PlaylogForm = () => {
  const {id} = useParams();
  const { openDeleteDialog } = useDialogProvider();
  const {isLoading, getPlaylogById, updatePlaylog, createPlaylog, deletePlaylog} = usePlaylogContext();
  const { isLoading: usersLoading, users} = useUserContext();
  const navigate = useNavigate();

  const isCreateMode = !id || id === 'new';

  const [inEdit, setIsInEdit] = useState<boolean>(isCreateMode);
  const [formData, setFormData] = useState<PlayLog | null>(isCreateMode ? emptyPlaylog : null);

  const currentPlaylog = !isCreateMode ? getPlaylogById(Number(id)) : null;

  useEffect(() => {
    if (!isCreateMode && currentPlaylog) {
      setFormData(currentPlaylog);
    }
  }, [currentPlaylog, isCreateMode]);

  if (!isCreateMode && (isLoading || usersLoading || !formData)) return <Typography sx={{ p: 4 }}>Loading...</Typography>;
  if (!formData) return null;

  const handleSave = async () => {
    try {
      if (isCreateMode) {
        await createPlaylog(formData);
        toast.success("Playlog created successfully!");
        navigate(`/plays`);
      } else {
        await updatePlaylog(Number(id), formData);
        setIsInEdit(false);
        toast.success("Playlog updated successfully!");
      }
    } catch (error) {
      toast.error(`Failed to ${isCreateMode ? 'create' : 'update'} playlog.`);
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
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
          {isCreateMode ? "Add New Playlog" : "Playlog Details"}
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

        {/* Multi-Select Listeners */}
        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Listener(s)</FormLabel>
          <Autocomplete
            multiple
            disabled={!inEdit}
            options={users}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            value={formData.listeners}
            onChange={(_event, newValue) => {
              setFormData({ ...formData, listeners: newValue });
            }}
            renderInput={(params) => (
              <TextField {...params} placeholder={inEdit ? "Select Listeners" : ""} />
            )}
            renderValue={(tagValue, getTagProps) =>
              tagValue.map((option, index) => (
                <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
              ))
            }
          />
        </Grid>

        <Grid size={12}>
          <FormLabel sx={{ mb: 1, display: 'block', fontWeight: 'bold' }}>Date</FormLabel>
          <TextField
            type="date"
            value={formData.date ? formData.date.toISOString().split('T')[0] : ""}
            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
            fullWidth
            disabled={!inEdit}
          />
        </Grid>

        <Grid size={12} sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 2 }}>
          {inEdit ? (
            <>
              <Button variant="outlined" size="large" onClick={handleCancel}>
                Cancel
              </Button>
              
              {!isCreateMode && (
                <Button variant="contained" size="large" onClick={() => openDeleteDialog({name: `${formData.artist} - ${formData.album}`, type: "Playlog"}, handleConfirmDelete)} color="error">
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
  )
}

export default PlaylogForm
