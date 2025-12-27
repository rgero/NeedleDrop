import { LocationContext } from "./LocationContext";
import { getLocations } from "@services/apiLocations";
import { useQuery } from "@tanstack/react-query";

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {data: locations = [], error, isLoading, isFetching} = useQuery({queryKey: ["locations"], queryFn: getLocations});
  
  return (
    <LocationContext.Provider
      value={{
        locations,
        error,
        isLoading,
        isFetching
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

