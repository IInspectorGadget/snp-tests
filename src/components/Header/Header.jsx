import cx from "classnames";

import s from "./Header.module.scss";
import { Link } from "react-router-dom";
import { userLogout } from "@src/utils/userSaga";
import { useDispatch } from "react-redux";

const Header = ({ className }) => {
  const dispatch = useDispatch();
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
            <span onClick={() => dispatch(userLogout())} className={s.logout}>
              выход
            </span>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
