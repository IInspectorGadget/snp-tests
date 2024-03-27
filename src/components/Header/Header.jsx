import cx from "classnames";

import s from "./Header.module.scss";
import { Link } from "react-router-dom";
import { useGetCurrentUserQuery, useLogoutMutation } from "@src/utils/testsApi";

const Header = ({ className }) => {
  const { data } = useGetCurrentUserQuery();
  const [logout] = useLogoutMutation();
  const handlerLogout = () => {
    logout();
  };
  return (
    <div className={cx(s.root, className)}>
      <nav className={s.nav}>
        <ul className={s.list}>
          <li className={s.item}>
            <Link className={s.link} to='/'>
              Список тестов
            </Link>
          </li>
          <li className={s.item}>
            <Link className={s.link} to='/create'>
              Создать
            </Link>
          </li>
          <li className={s.item}>
            <span onClick={handlerLogout} className={s.logout}>
              выход
            </span>
          </li>
          <li className={s.item}>{data.username}</li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
