import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "@/store/useAuthStore";

const ProtectedRoute = () => {
  const { isAuthenticated, _hasHydrated } = useAuthStore();
  if (!_hasHydrated) return null;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;