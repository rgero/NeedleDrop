import { getWantedItems, updateWantedItem } from "@services/apiWantedItems";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { WantedItem } from "@interfaces/WantedItem";
import { WantedItemContext } from "./WantedItemContext";

export const WantedItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  
  const {data: wanteditems = [], error, isLoading, isFetching} = useQuery({queryKey: ["wanteditem"], queryFn: getWantedItems});

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedItem }: { id: number; updatedItem: Partial<WantedItem> }) => 
      updateWantedItem(id, updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wanteditem"] });
    },
  });

  const getWantedItemById = (id: number): WantedItem | null => {
    return wanteditems.find((item) => item.id === id) || null;
  };

  const updatedWantedItem = (id: number, updatedItem: Partial<WantedItem>) => {
    updateMutation.mutate({ id, updatedItem });
  };

  return (
    <WantedItemContext.Provider
      value={{
        getWantedItemById,
        updatedWantedItem,
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

