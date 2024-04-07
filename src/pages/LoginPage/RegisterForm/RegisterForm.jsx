import { memo, useCallback, useState } from "react";
import Input from "@src/components/Input";
import { Link } from "react-router-dom";
import Button from "@src/components/Button";
import Error from "@src/components/Error";
import { useSignupMutation } from "@src/utils/testsApi";
import CheckBox from "@src/components/CheckBox";
import FormItem from "@src/components/FormItem";

const RegisterForm = memo(({ classNames, refetchUserData }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [dirty, setDirty] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [signup] = useSignupMutation();
  const handlerSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (password !== passwordConfirmation) {
        setError("Пароли не совпадают");
        setDirty(true);
        return;
      }
      if (!password.length || !username.length) {
        setError("Заполните все поля");
        setDirty(true);
        return;
      }
      setDirty(false);
      setError("");
      const { error } = await signup({ username, password, password_confirmation: passwordConfirmation, is_admin: isAdmin });
      if (error?.status) {
        setError("Ошибка сервера");
        setDirty(true);
        return;
      }
      refetchUserData();
    },
    [signup, password, username, passwordConfirmation, isAdmin, refetchUserData],
  );

  return (
    <form onSubmit={handlerSubmit}>
      <div className={classNames.container}>
        <p className={classNames.title}>Регистрация</p>
        <FormItem className={classNames.item} title='Логин'>
          <Input value={username} setValue={setUsername} className={classNames.input} type='text' isRequired />
        </FormItem>
        <FormItem className={classNames.item} title='Пароль'>
          <Input type='password' value={password} setValue={setPassword} className={classNames.input} isRequired />
        </FormItem>
        <FormItem className={classNames.item} title='Повторите пароль'>
          <Input type='password' value={passwordConfirmation} setValue={setPasswordConfirmation} className={classNames.input} isRequired />
        </FormItem>
        <FormItem title='Администратор?' inline>
          <CheckBox isChecked={isAdmin} setIsChecked={setIsAdmin} onChange={(e) => setIsAdmin(e.target.checked)} />
        </FormItem>
        <Error error={error} dirty={dirty} />
        <Link to='/auth/login'>Войти?</Link>
        <div className={classNames.item}>
          <Button type='submit' />
        </div>
      </div>
    </form>
  );
});

RegisterForm.displayName = "RegisterForm";

export default RegisterForm;
