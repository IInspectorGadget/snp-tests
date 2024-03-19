import cx from "classnames";

import s from "./LoginPage.module.scss";
import Input from "@src/components/Input";
import Button from "@src/components/Button";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkUserExistence } from "@src/utils/userSaga";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ className }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loading = useSelector((state) => state.user.loading);
  const auth = useSelector((state) => state.user.auth);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handlerSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(checkUserExistence(username, password));
    },
    [dispatch, password, username],
  );

  useEffect(() => {
    loading && auth && navigate("/");
  }, [loading, auth, navigate]);

  return (
    <div className={cx(s.root, className)}>
      <form onSubmit={handlerSubmit}>
        <div className={s.container}>
          <p className={s.title}>Вход</p>
          <div className={s.item}>
            <span className={s.label}>Логин</span>
            <Input value={username} setValue={setUsername} className={s.input} type='text' />
          </div>
          <div className={s.item}>
            <span className={s.label}>Пароль</span>
            <Input value={password} setValue={setPassword} className={s.input} type='text' />
          </div>
          <div className={s.item}>
            <Button type='submit' />
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
