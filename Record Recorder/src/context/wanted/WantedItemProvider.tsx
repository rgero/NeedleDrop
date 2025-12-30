import type { WantedItem } from "@interfaces/WantedItem";
import { WantedItemContext } from "./WantedItemContext";
import { getWantedItems } from "@services/apiWantedItems";
import { useQuery } from "@tanstack/react-query";

export const WantedItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  const {data: wanteditems = [], error, isLoading, isFetching} = useQuery({queryKey: ["wanteditem"], queryFn: getWantedItems});

  const getWantedItemById = (id: number) : WantedItem | null => {
    const item = wanteditems.find((wantedItem) => wantedItem.id === id);
    return item || null;
  }
  
  return (
    <WantedItemContext.Provider
      value={{
        getWantedItemById,
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

