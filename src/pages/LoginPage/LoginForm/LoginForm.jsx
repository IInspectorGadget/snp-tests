import Input from "@src/components/Input";

import { memo, useCallback, useState } from "react";
import Button from "@src/components/Button";
import { Link } from "react-router-dom";
import { useSigninMutation } from "@src/utils/testsApi";

import s from "./LoginForm.module.scss";

const LoginForm = memo(({ classNames, refetchUserData }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signin] = useSigninMutation();
  const [error, setError] = useState("");

  const handlerSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { error } = await signin({ username, password });
      if (error?.status === 400) {
        setError("Не верный логин или пароль");
      } else if (error?.status === 401) {
        setError("Недопустимые значения");
      } else {
        setError("");
        refetchUserData();
      }
    },
    [signin, refetchUserData, password, username],
  );

  return (
    <form onSubmit={handlerSubmit}>
      <div className={classNames.container}>
        <p className={classNames.title}>Вход</p>
        <div className={classNames.item}>
          <span className={classNames.label}>Логин</span>
          <Input value={username} setValue={setUsername} className={classNames.input} type='text' />
        </div>
        <div className={classNames.item}>
          <span className={classNames.label}>Пароль</span>
          <Input type='password' value={password} setValue={setPassword} className={classNames.input} />
        </div>
        {error.length !== 0 && <p className={s.error}>{error}</p>}
        <Link to='/auth/register'>Зарегистрироваться?</Link>
        <div className={classNames.item}>
          <Button type='submit' value='Войти' />
        </div>
      </div>
    </form>
  );
});

LoginForm.displayName = "LoginForm";

export default LoginForm;
