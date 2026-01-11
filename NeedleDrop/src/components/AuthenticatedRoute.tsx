import { Navigate, useLocation } from "react-router-dom";

import Loading from "./ui/Loading";
import React from "react";
import { useAuthenticationContext } from "../context/authentication/AuthenticationContext";

const AuthenticatedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuthenticationContext();
  const location = useLocation();

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return <Navigate to="/landing" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AuthenticatedRoute;
