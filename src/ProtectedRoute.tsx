import { Outlet, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { RoutesMain } from "./common/enums/routes";

const ProtectedRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to={RoutesMain.Login} />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
