import { createPlaylog as createPlaylogAPI, deletePlaylog as deletePlaylogAPI, getPlaylogs, updatePlaylog as updatePlaylogAPI } from "@services/apiPlaylogs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PlayLog } from "@interfaces/PlayLog";
import { PlaylogContext } from "./PlaylogContext";

export const PlaylogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const {data: playlogs = [], error, isLoading, isFetching} = useQuery({queryKey: ["playlogs"], queryFn: getPlaylogs});
  
  const createMutation = useMutation({
    mutationFn: (newItem: Omit<PlayLog, 'id'>) => createPlaylogAPI(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlogs"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedItem }: { id: number; updatedItem: Partial<PlayLog> }) => 
      updatePlaylogAPI(id, updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlogs"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deletePlaylogAPI(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["playlogs"] });
    },
  });

  const getPlaylogById = (id: number): PlayLog | null => {
    return playlogs.find((playlog) => playlog.id === id) || null;
  };

  const createPlaylog = async (newItem: Omit<PlayLog, 'id'>) => {
    return await createMutation.mutateAsync(newItem);
  };

  const updatePlaylog = (id: number, updatedItem: Partial<PlayLog>) => {
      updateMutation.mutate({ id, updatedItem });
  };

  const deletePlaylog = (id: number) => {
      deleteMutation.mutate(id);
  }
  
  return (
    <PlaylogContext.Provider
      value={{
        getPlaylogById,
        playlogs,
        error,
        isLoading,
        isFetching,
        createPlaylog,
        updatePlaylog,
        deletePlaylog
      }}
    >
      {children}
    </PlaylogContext.Provider>
  );
}

