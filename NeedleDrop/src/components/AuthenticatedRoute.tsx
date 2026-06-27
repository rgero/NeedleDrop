import { Navigate, useLocation } from "react-router-dom";

import Loading from "./ui/Loading";
import React from "react";
import { useAuthenticationContext } from "../context/authentication/AuthenticationContext";
import { useUserContext } from "../context/users/UserContext";

const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthenticationContext();
  const { isLoading: isUserLoading, currentUser } = useUserContext();
  const location = useLocation();

  if (isLoading || isUserLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  if (!currentUser) {
    return <Navigate to="/landing" replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
