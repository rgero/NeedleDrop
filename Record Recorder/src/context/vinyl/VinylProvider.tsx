import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Vinyl } from "@interfaces/Vinyl";
import { VinylContext } from "./VinylContext";
import { getVinyls } from "@services/apiVinyls";

export const VinylProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const {data: vinyls = [], error, isLoading, isFetching} = useQuery({queryKey: ["vinyl"], queryFn: getVinyls});

  // const createMutation = useMutation({
  //   mutationFn: (newItem: Omit<Vinyl, 'id'>) => createVinylAPI(newItem),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["vinyls"] });
  //   },
  // });

  // const updateMutation = useMutation({
  //   mutationFn: ({ id, updatedItem }: { id: number; updatedItem: Partial<Vinyl> }) => 
  //     updateVinylAPI(id, updatedItem),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["vinyls"] });
  //   },
  // });

  // const deleteMutation = useMutation({
  //   mutationFn: (id: number) => {
  //     return deleteVinylAPI(id);
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["vinyls"] });
  //   },
  // });

  const getVinylById = (id: number): Vinyl | null => {
    return vinyls.find((vinyl) => vinyl.id === id) || null;
  };

  const createVinyl = async (newItem: Omit<Vinyl, 'id'>) => {
    //return await createMutation.mutateAsync(newItem);
    return {} as Vinyl;
  };

  const updateVinyl = (id: number, updatedItem: Partial<Vinyl>) => {
    //updateMutation.mutate({ id, updatedItem });
  };

  const deleteVinyl = (id: number) => {
    //deleteMutation.mutate(id);
  }
  
  return (
    <VinylContext.Provider
      value={{
        vinyls,
        getVinylById,
        createVinyl,
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

