import { memo, useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import cx from "classnames";

// import Modal from "@components/Modal";
import Container from "@components/Container";
// import DetailView from "@components/DetailView";
// import Form from "@components/Form";

import s from "./Main.module.scss";
import editSvg from "@src/assets/edit.svg";
import viewSvg from "@src/assets/view.svg";
import { useGetTestsQuery } from "@src/utils/testsApi";

const Main = memo(({ filter }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState(null);
  const { data: tests, isLoading, isError, isSuccess } = useGetTestsQuery({ page: 1, per: 5, search: "", sort: "created_at_desc" });

  const { pathname } = useLocation();

  const checkItem = useCallback(
    (item) => {
      if (!filter) {
        return true;
      }
      const title = item.title.toLowerCase();
      const filterStr = filter.toLowerCase();
      return title.includes(filterStr);
    },
    [filter],
  );

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const handlerClickShowButton = useCallback(
    (e) => {
      const newId = e.currentTarget.id;
      setIsVisible(true);
      setIsEdit(false);
      setId(Number(newId));
    },
    [setIsVisible, setId],
  );

  const handlerClickEditButton = useCallback(
    (e) => {
      const newId = e.currentTarget.id;
      setIsVisible(true);
      setIsEdit(true);
      setId(Number(newId));
    },
    [setIsEdit, setId],
  );
  return (
    !isLoading && (
      <main className={s.root}>
        <Container>
          <ul className={s.list}>
            {tests?.tests
              ?.filter((item) => checkItem(item))
              ?.map((item, idx) => (
                <li key={idx} className={s.item}>
                  <Link to={`/edit/${item.id}/`} className={s.link} />
                  <div className={s.info}>
                    <p className={s.title}>{item.title}</p>
                    <p className={s.date}>{item.date}</p>
                  </div>
                  <div className={s.buttons}>
                    <img src={editSvg} alt='edit' className={cx(s.img, s.imgEdit)} id={item.id} onClick={handlerClickEditButton} />
                    <img src={viewSvg} alt='view' className={cx(s.img, s.imgView)} id={item.id} onClick={handlerClickShowButton} />
                  </div>
                </li>
              ))}
          </ul>
        </Container>
        {/* {id && isVisible && (
          <Modal isVisible={isVisible} closeModal={closeModal}>
            {isEdit ? <Form closeModal={closeModal} isEdit id={id} /> : <DetailView id={id} />}
          </Modal>
        )} */}
      </main>
    )
  );
});

Main.displayName = "Main";

export default Main;
