import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";

import "./App.scss";
import { useGetCurrentUserQuery } from "./utils/testsApi";

function App() {
  const { isLoading, isSuccess } = useGetCurrentUserQuery();

  return (
    !isLoading && (
      <div className='root'>
        <Router>
          <Routes>
            <Route element={<PrivateRoute isAuth={isSuccess} />}>
              <Route element={<HomePage />} path='*' exact />
            </Route>
            <Route element={<LoginPage isAuth={isSuccess} />} path='/auth/*' />
          </Routes>
        </Router>
      </div>
    )
  );
}

export default App;
