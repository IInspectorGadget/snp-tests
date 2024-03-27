import Input from "@src/components/Input";
import s from "./LoginForm.module.scss";
import { useCallback, useState } from "react";
import Button from "@src/components/Button";
import { Link } from "react-router-dom";
import { useSigninMutation, setCurrentUser } from "@src/utils/testsApi";
import { useDispatch } from "react-redux";

const LoginForm = ({ classNames }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [signin, { isLoading, isError }] = useSigninMutation();

  const handlerSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const { data } = await signin({ username, password });
      // dispatch(
      //   setCurrentUser({
      //     user: data,
      //     isAuth: true,
      //   }),
      // );
      // localStorage.setItem("user", JSON.stringify(data));
      // localStorage.setItem("isAuth", true);
    },
    [signin, dispatch, password, username],
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
          <Input value={password} setValue={setPassword} className={classNames.input} type='text' />
        </div>
        <Link to='/auth/register'>Зарегистрироваться?</Link>
        <div className={classNames.item}>
          <Button type='submit' />
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
