import cx from "classnames";

import { memo, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

import s from "./LoginPage.module.scss";

const LoginPage = memo(({ className, isAuth, refetchUserData }) => {
  const navigate = useNavigate();

  useEffect(() => {
    isAuth && navigate("/");
  }, [isAuth, navigate]);

  return (
    <div className={cx(s.root, className)}>
      <Routes>
        <Route element={<LoginForm refetchUserData={refetchUserData} classNames={s} />} path='/login' />
        <Route element={<RegisterForm refetchUserData={refetchUserData} classNames={s} />} path='/register' />
      </Routes>
    </div>
  );
});

LoginPage.displayName = "LoginPage";

export default LoginPage;
