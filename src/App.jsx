import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";
import { useGetCurrentUserQuery } from "./utils/testsApi";

import "./App.scss";

function App() {
  const { data, isSuccess, isLoading, refetch } = useGetCurrentUserQuery();

  return (
    <div className='root'>
      <Router>
        <Routes>
          <Route element={<PrivateRoute isAuth={isSuccess} isLoading={isLoading} />}>
            <Route element={<HomePage data={data} isLoading={isLoading} />} path='*' exact />
          </Route>
          <Route element={<LoginPage refetchUserData={refetch} isAuth={isSuccess} isLoading={isLoading} />} path='/auth/*' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
