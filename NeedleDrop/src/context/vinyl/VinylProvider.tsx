import {createVinyl as createVinylAPI, deleteVinyl as deleteVinylAPI, updateVinyl as updateVinylAPI} from "@services/apiVinyls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { RoundNumber } from "@utils/RoundNumber";
import type { Vinyl } from "@interfaces/Vinyl";
import { VinylContext } from "./VinylContext";
import { getVinyls } from "@services/apiVinyls";
import supabase from "@services/supabase";
import { useEffect } from "react";

export const VinylProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const {data: vinyls = [], error, isLoading, isFetching} = useQuery({queryKey: ["vinyls"], queryFn: getVinyls, placeholderData: (previousData) => previousData});

  /* Real-time subscription to vinyls table changes - if this doesn't work, remove it and disable it in Supabase.*/
  useEffect(() => {
    const channel = supabase.channel('vinyls-realtime').on(
        'postgres_changes',
        {
          event: '*', // Listen for ALL changes (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'vinyls',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["vinyls"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createMutation = useMutation({
    mutationFn: (newItem: Omit<Vinyl, 'id'>) => createVinylAPI(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedItem }: { id: number; updatedItem: Partial<Vinyl> }) => 
      updateVinylAPI(id, updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteVinylAPI(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vinyls"] });
    },
  });

  const getVinylById = (id: number): Vinyl | null => {
    return vinyls.find((vinyl) => vinyl.id === id) || null;
  };

  const createVinyl = async (newItem: Omit<Vinyl, 'id'>) => {
    return await createMutation.mutateAsync(newItem);
  };

  const updateVinyl = (id: number, updatedItem: Partial<Vinyl>) => {
    updateMutation.mutate({ id, updatedItem });
  };

  const deleteVinyl = (id: number) => {
    deleteMutation.mutate(id);
  }

  const getVinylsOwnedByUserId = (id: string): Vinyl[] => {
    return vinyls.filter( (item: Vinyl) => {
      const owners = item.owners.map( item => item.id);
      return owners.includes(id);;
    })
  }

  const getVinylsBoughtByUserId = (id: string): Vinyl[] => {
    return vinyls.filter( (item: Vinyl) => {
      const purchasedBy = item.purchasedBy.map( item => item.id);
      return purchasedBy.includes(id);;
    })
  }

  const calculateValueById = (id: string) => {
    const vinylList = getVinylsOwnedByUserId(id);
    if (vinylList.length === 0) return 0.0;

    const total = vinylList.reduce((sum: number, item: Vinyl) => {
        if (!item.price) return sum;
        return sum + item.price / item.owners.length;
      }, 0)
    return RoundNumber(total);
  }

  const calculateTotalSpentById = (id: string) => {
    const vinylList = getVinylsBoughtByUserId(id);
    if (vinylList.length === 0) return 0.0;

    const total = vinylList.reduce((sum: number, item: Vinyl) => {
        if (!item.price) return sum;
        return sum + item.price / item.owners.length;
      }, 0)
    return RoundNumber(total);
  }

  const calculateTotalPrice = () => {
    const total = vinyls.reduce((sum: number, item: Vinyl) => {
        if (!item.price) return sum;
        return sum + item.price / item.owners.length;
      }, 0)
    return RoundNumber(total);
  }
  
  return (
    <VinylContext.Provider
      value={{
        vinyls,
        getVinylById,
        createVinyl,
        getVinylsOwnedByUserId,
        getVinylsBoughtByUserId,
        calculateValueById,
        calculateTotalSpentById,
        calculateTotalPrice,
        updateVinyl,
        deleteVinyl,
        error,
        isLoading,
        isFetching
      }}
    >
      {children}
    </VinylContext.Provider>
  );
}

