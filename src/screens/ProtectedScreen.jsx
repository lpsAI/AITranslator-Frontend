import { Navigate, Outlet, useLocation } from "react-router"
import { useAuth } from "../context/AuthContext";

export const ProtectedScreen = () => {
  const location = useLocation();
  const localUser = JSON.parse(localStorage.getItem('user'));

 const { user } = useAuth()

  return (user || localUser) && (user.id || localUser.id) ? <Outlet /> : <Navigate to={'/login'} replace state={{ from: location.pathname}} />
}