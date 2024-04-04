import cx from "classnames";

import { memo } from "react";
import { Link } from "react-router-dom";
import { useLogoutMutation } from "@src/utils/testsApi";

import exitSvg from "@src/assets/exit.svg";

import s from "./Header.module.scss";

const Header = memo(({ className, userData }) => {
  const [logout] = useLogoutMutation();

  return (
    <div className={cx(s.root, className)}>
      <nav className={s.nav}>
        <ul className={s.list}>
          <li className={s.item}>
            <Link className={s.link} to='/'>
              Список тестов
            </Link>
          </li>
          {userData.is_admin && (
            <li className={s.item}>
              <Link className={s.link} to='/create'>
                Создать
              </Link>
            </li>
          )}
          <li className={s.item}>{userData?.username}</li>
          <img src={exitSvg} alt='edit' onClick={logout} className={s.logout} />
        </ul>
      </nav>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
