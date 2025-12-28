import { WantedItemContext } from "./WantedItemContext";
import { getWantedItems } from "@services/apiWantedItems";
import { useQuery } from "@tanstack/react-query";

export const WantedItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const {data: wanteditems = [], error, isLoading, isFetching} = useQuery({queryKey: ["wanteditem"], queryFn: getWantedItems});
  
  return (
    <WantedItemContext.Provider
      value={{
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

