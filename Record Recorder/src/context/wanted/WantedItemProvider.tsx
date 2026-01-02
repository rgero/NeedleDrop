import { createWantedItem as createWantedItemAPI, deleteWantedItem as deleteWantedItemAPI, getWantedItems, updateWantedItem as updateWantedItemAPI } from "@services/apiWantedItems";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { WantedItem } from "@interfaces/WantedItem";
import { WantedItemContext } from "./WantedItemContext";

export const WantedItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  const {data: wanteditems = [], error, isLoading, isFetching} = useQuery({queryKey: ["wanteditem"], queryFn: getWantedItems});

  const createMutation = useMutation({
    mutationFn: (newItem: Omit<WantedItem, 'id'>) => createWantedItemAPI(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wanteditem"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedItem }: { id: number; updatedItem: Partial<WantedItem> }) => 
      updateWantedItemAPI(id, updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wanteditem"] });
    },
  });

  const createWantedItem = async (newItem: Omit<WantedItem, 'id'>): Promise<WantedItem> => {
    return await createMutation.mutateAsync(newItem);
  };

  const getWantedItemById = (id: number): WantedItem | null => {
    return wanteditems.find((item) => item.id === id) || null;
  };

  const updateWantedItem = (id: number, updatedItem: Partial<WantedItem>) => {
    updateMutation.mutate({ id, updatedItem });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteWantedItemAPI(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wanteditem"] });
    },
  });

  const deleteWantedItem = async (id: number): Promise<void> => {
    await deleteMutation.mutate(id);
  }

  return (
    <WantedItemContext.Provider
      value={{
        createWantedItem,
        getWantedItemById,
        deleteWantedItem,
        updateWantedItem,
        wanteditems,
        error,
        isLoading,
        isFetching
      }}
    >
      {children}
    </WantedItemContext.Provider>
  );
}

