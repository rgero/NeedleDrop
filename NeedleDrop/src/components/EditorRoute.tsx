import React from "react";
import { Navigate, useLocation } from "react-router-dom";

import Loading from "./ui/Loading";
import { useAuthenticationContext } from "../context/authentication/AuthenticationContext";
import { useUserContext } from "../context/users/UserContext";

const EditorRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading: isAuthLoading } = useAuthenticationContext();
  const { currentUser, isEditor, isLoading: isUserLoading } = useUserContext();
  const location = useLocation();
  const fallbackPath = location.pathname.replace(/\/create\/?$/, "") || "/";

  if (isAuthLoading || isUserLoading) {
    return <Loading />;
  }

  if (!user || !currentUser || !isEditor) {
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default EditorRoute;