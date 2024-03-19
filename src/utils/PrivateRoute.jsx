import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const auth = useSelector((state) => state.user.auth);
  return auth ? <Outlet /> : <Navigate to='/login' />;
};

export default PrivateRoute;
