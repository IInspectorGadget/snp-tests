import cx from "classnames";

import s from "./RegisterForm.module.scss";
import { useDispatch } from "react-redux";
import { useCallback, useState } from "react";
import { signupUser } from "@src/utils/userSaga";
import Input from "@src/components/Input";
import { Link } from "react-router-dom";
import Button from "@src/components/Button";

const RegisterForm = ({ classNames }) => {
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const handlerSubmit = useCallback(
    (e) => {
      e.preventDefault();
      dispatch(signupUser(username, password, passwordConfirmation, isAdmin));
    },
    [dispatch, password, username, passwordConfirmation, isAdmin],
  );

  return (
    <form onSubmit={handlerSubmit}>
      <div className={classNames.container}>
        <p className={classNames.title}>Регистрация</p>
        <div className={classNames.item}>
          <span className={classNames.label}>Логин</span>
          <Input value={username} setValue={setUsername} className={classNames.input} type='text' />
        </div>
        <div className={classNames.item}>
          <span className={classNames.label}>Пароль</span>
          <Input value={password} setValue={setPassword} className={classNames.input} type='text' />
        </div>
        <div className={classNames.item}>
          <span className={classNames.label}>Повторите пароль</span>
          <Input value={passwordConfirmation} setValue={setPasswordConfirmation} className={classNames.input} type='text' />
        </div>
        <div className={classNames.item}>
          <span className={classNames.label}>Администратор?</span>
          <input type='checkbox' checked={isAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        </div>
        <Link to='/auth/login'>Войти?</Link>
        <div className={classNames.item}>
          <Button type='submit' />
        </div>
      </div>
    </form>
  );
};

export default RegisterForm;
