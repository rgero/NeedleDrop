import { createPlaylog as createPlaylogAPI, deletePlaylog as deletePlaylogAPI, getPlaylogs, updatePlaylog as updatePlaylogAPI } from "@services/apiPlaylogs";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { PlayLog } from "@interfaces/PlayLog";
import { PlaylogContext } from "./PlaylogContext";
import supabase from "@services/supabase";
import { useEffect } from "react";

export const PlaylogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const {data: playlogs = [], error, isLoading, isFetching} = useQuery({queryKey: ["playlogs"], queryFn: getPlaylogs, placeholderData: (previousData) => previousData});

  /* Real-time subscription to playlogs table changes - if this doesn't work, remove it and disable it in Supabase.*/
  useEffect(() => {
    const channel = supabase.channel('playlogs-realtime').on(
        'postgres_changes',
        {
          event: '*', // Listen for ALL changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'playlogs',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["playlogs"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
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

  const getPlaylogsByUserId = (id: string): PlayLog[] => {
    return playlogs.filter( (item: PlayLog) => {
      const listeners = item.listeners.map( item => item.id);
      return listeners.includes(id);;
    })
  }
  
  return (
    <PlaylogContext.Provider
      value={{
        getPlaylogById,
        getPlaylogsByUserId,
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

