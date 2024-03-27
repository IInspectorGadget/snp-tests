import cx from "classnames";

import s from "./LoginPage.module.scss";
import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const LoginPage = ({ className, isAuth }) => {
  const navigate = useNavigate();

  useEffect(() => {
    isAuth && navigate("/");
  }, [isAuth, navigate]);

  return (
    <div className={cx(s.root, className)}>
      <Routes>
        <Route element={<LoginForm classNames={s} />} path='/login' />
        <Route element={<RegisterForm classNames={s} />} path='/register' />
      </Routes>
    </div>
  );
};

export default LoginPage;
