import { UserContext } from "./UserContext";
import { getUsers } from "@services/apiUsers";
import { useQuery } from "@tanstack/react-query";

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {data: users = [], error, isLoading, isFetching} = useQuery({queryKey: ["users"], queryFn: getUsers});
  
  return (
    <UserContext.Provider
      value={{
        users,
        error,
        isLoading,
        isFetching
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

