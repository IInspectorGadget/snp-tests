import { memo, useCallback, useState } from "react";

// import Modal from "@components/Modal";
// import Form from "@components/Form";

import s from "./Header.module.scss";
import { useGetTestsQuery } from "@src/utils/testsApi";

const Header = memo(({ filter, setFilter }) => {
  const [isVisible, setIsVisible] = useState(false);
  const { data: tests, isLoading, isError, isSuccess } = useGetTestsQuery();

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const handlerClick = useCallback(() => {
    setIsVisible(true);
  }, [setIsVisible]);

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
      <button className={s.addButton} onClick={() => 1}>
        Сортировка
      </button>

      {/* {isVisible && (
        <Modal closeModal={closeModal}>
          <Form closeModal={closeModal} />
        </Modal>
      )} */}
    </div>
  );
});

Header.displayName = "Header";

export default Header;
