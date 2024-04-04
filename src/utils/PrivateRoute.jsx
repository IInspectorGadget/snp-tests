import { Navigate, Outlet, useLocation } from "react-router-dom";

const PrivateRoute = ({ isAuth, isLoading }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth/login" || location.pathname === "/auth/register";
  if (isLoading) {
    return <Outlet />;
  }
  return isAuth || isAuthPage ? <Outlet /> : <Navigate to='/auth/login' />;
};

export default PrivateRoute;
