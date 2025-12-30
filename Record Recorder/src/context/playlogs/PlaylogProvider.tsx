import { PlaylogContext } from "./PlaylogContext";
import { getPlaylogs } from "@services/apiPlaylogs";
import { useQuery } from "@tanstack/react-query";

export const PlaylogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {data: playlogs = [], error, isLoading, isFetching} = useQuery({queryKey: ["playlogs"], queryFn: getPlaylogs});
  
  return (
    <PlaylogContext.Provider
      value={{
        playlogs,
        error,
        isLoading,
        isFetching
      }}
    >
      {children}
    </PlaylogContext.Provider>
  );
}

