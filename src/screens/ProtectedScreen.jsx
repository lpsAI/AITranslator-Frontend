import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "../context/AuthContext";

export const ProtectedScreen = () => {
  const location = useLocation();

 const { user } = useAuth()

  return user && user?.id ? <Outlet /> : <Navigate to={'/login'} replace state={{ from: location.pathname}} />
}