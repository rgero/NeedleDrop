import { createLocation as createLocationAPI, deleteLocation as deleteLocationAPI, getLocations, updateLocation as updateLocationAPI } from "@services/apiLocations";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Location } from "@interfaces/Location";
import { LocationContext } from "./LocationContext";

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient();
  const {data: locations = [], error, isLoading, isFetching} = useQuery({queryKey: ["locations"], queryFn: getLocations});
  
  const createMutation = useMutation({
    mutationFn: (newItem: Omit<Location, 'id'>) => createLocationAPI(newItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updatedItem }: { id: number; updatedItem: Partial<Location> }) => 
      updateLocationAPI(id, updatedItem),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => {
      return deleteLocationAPI(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });

  const getLocationById = (id: number): Location | null => {
    return locations.find((location) => location.id === id) || null;
  };

  const createLocation = async (newItem: Omit<Location, 'id'>) => {
    return await createMutation.mutateAsync(newItem);
  };

  const updateLocation = (id: number, updatedItem: Partial<Location>) => {
      updateMutation.mutate({ id, updatedItem });
  };

  const deleteLocation = (id: number) => {
      deleteMutation.mutate(id);
  }
  
  return (
    <LocationContext.Provider
      value={{
        getLocationById,
        locations,
        error,
        isLoading,
        isFetching,
        createLocation,
        updateLocation,
        deleteLocation
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

