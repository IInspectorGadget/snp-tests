import { memo, useCallback } from "react";

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

  const handlerChange = useCallback(
    (e) => {
      setFilter(e.currentTarget.value);
    },
    [setFilter],
  );

  return (
    <div className={s.root}>
      <div className={s.filter}>
        <input type='search' className={s.search} value={filter} placeholder='Поиск' onChange={handlerChange} />
      </div>
      <button className={s.addButton} onClick={handlerSort}>
        Сортировка
      </button>
    </div>
  );
});

Header.displayName = "Header";

export default Header;
