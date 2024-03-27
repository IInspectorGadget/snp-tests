import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { selectIsAuthenticated, useGetCurrentUserQuery } from "./testsApi";
import { useEffect, useMemo } from "react";

const PrivateRoute = ({ isAuth }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/auth/login" || location.pathname === "/auth/register";
  return isAuth || isAuthPage ? <Outlet /> : <Navigate to='/auth/login' />;
};

export default PrivateRoute;
