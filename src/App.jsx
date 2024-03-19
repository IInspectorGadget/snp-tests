import { Provider, useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import store from "./utils/store";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PrivateRoute from "./utils/PrivateRoute";

import "./App.scss";

function App() {
  return (
    <div className='root'>
      <Router>
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<HomePage />} path='*' exact />
          </Route>
          <Route element={<LoginPage />} path='/login' />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
