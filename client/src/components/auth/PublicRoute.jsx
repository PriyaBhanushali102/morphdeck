import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

const PublicRoute = () => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  if (!_hasHydrated) return null;
  return isAuthenticated ? <Navigate to="/home" replace /> : <Outlet />;
};

export default PublicRoute;