import { memo, useCallback } from "react";
import Input from "@src/components/Input";

import s from "./Header.module.scss";

const Header = memo(({ filter, setFilter, setSort }) => {
  const handlerSort = useCallback(() => {
    setSort((prev) => {
      if (prev === "created_at_desc") {
        return "created_at_asc ";
      } else {
        return "created_at_desc";
      }
    });
  }, [setSort]);

  return (
    <div className={s.root}>
      <div className={s.filter}>
        <Input type='search' className={s.search} value={filter} placeholder='Поиск' setValue={setFilter} />
      </div>
      <button className={s.button} onClick={handlerSort}>
        Сортировка
      </button>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
