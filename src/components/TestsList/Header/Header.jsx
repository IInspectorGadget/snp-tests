import { memo, useCallback, useState } from "react";

// import Modal from "@components/Modal";
// import Form from "@components/Form";

import s from "./Header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { setOrder } from "@src/utils/testsSaga";

const Header = memo(({ filter, setFilter }) => {
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();
  const order = useSelector((state) => state.tests.order);
  console.log(order);

  const changeOrder = useCallback(() => {
    if (order) {
      dispatch(setOrder("-"));
    } else {
      dispatch(setOrder(""));
    }
  }, [order, dispatch]);

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
      <button className={s.addButton} onClick={() => changeOrder()}>
        Сортировка
      </button>
      <button className={s.addButton} onClick={handlerClick}>
        Добавить
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
