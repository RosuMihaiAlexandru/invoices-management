import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

export const ProtectedRoute = () => {
  const { access_token } = useSelector((state: RootState) => state.auth);

  // Check if the user is authenticated based on the presence of a token
  const isAuthenticated = !!access_token || !!localStorage.getItem("access_token");

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};
