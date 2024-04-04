import { memo } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = memo(({ isAdmin }) => {
  return isAdmin ? <Outlet /> : <Navigate to='/' />;
});

AdminRoute.displayName = "AdminRoute";

export default AdminRoute;
