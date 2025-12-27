import { VinylContext } from "./VinylContext";
import { getVinyls } from "@services/apiVinyls";
import { useQuery } from "@tanstack/react-query";

export const VinylProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const {data: vinyls = [], error, isLoading, isFetching} = useQuery({queryKey: ["vinyl"], queryFn: getVinyls});
  
  return (
    <VinylContext.Provider
      value={{
        vinyls,
        error,
        isLoading,
        isFetching
      }}
    >
      {children}
    </VinylContext.Provider>
  );
}

