import cx from "classnames";

import { memo, useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDeleteTestMutation } from "@src/utils/testsApi";
import Pagination from "../Pagination";
import Modal from "@src/components/Modal";
import Button from "@src/components/Button";

import editSvg from "@src/assets/edit.svg";
import deleteSvg from "@src/assets/delete.svg";

import s from "./Main.module.scss";

const Main = memo(({ userData, tests, page, setPage, PerPage }) => {
  const [deleteTest] = useDeleteTestMutation();
  const [isVisible, setIsVisible] = useState(false);
  const [id, setId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handlerDelete = useCallback(() => {
    closeModal();
    setId(null);
    deleteTest(id);
  }, [closeModal, deleteTest, id]);

  const handlerClickDeleteButton = useCallback(
    (id) => {
      setIsVisible(true);
      setId(id);
      setModalType("delete");
    },
    [setId],
  );

  const handlerClickStartPassing = useCallback(
    (id) => {
      setIsVisible(true);
      setId(id);
      setModalType("passing");
    },
    [setId],
  );

  const handlerPassingTest = useCallback(() => {
    navigate(`/passing/${id}/`);
  }, [navigate, id]);

  return (
    <main className={s.root}>
      <ul className={s.list}>
        {tests?.tests?.map((item, idx) => (
          <li key={idx} className={s.item}>
            <div className={s.link} onClick={() => handlerClickStartPassing(item.id)} />
            <div className={s.info}>
              <p className={s.title}>{item.title}</p>
              <p className={s.date}>{item.date}</p>
            </div>
            {userData?.is_admin && (
              <div className={s.buttons}>
                <Link to={`/edit/${item.id}/`}>
                  <img src={editSvg} alt='edit' className={cx(s.img, s.imgEdit)} id={item.id} />
                </Link>
                <img
                  src={deleteSvg}
                  alt='view'
                  className={cx(s.img, s.imgDelete)}
                  id={item.id}
                  onClick={() => handlerClickDeleteButton(item.id)}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
      {id && isVisible && (
        <Modal isVisible={isVisible} closeModal={closeModal} title={modalType === "delete" ? "Удаление" : "Начать тест"}>
          <div>
            <p className={s.modalText}>Вы уверены что хотите {modalType === "delete" ? "удалить" : "пройти тест"}</p>
            <div className={s.modalButtons}>
              <Button value='Да' type='button' onClick={modalType === "delete" ? handlerDelete : handlerPassingTest} />
              <Button value='Нет' type='button' onClick={closeModal} />
            </div>
          </div>
        </Modal>
      )}
      <Pagination itemsPerPage={PerPage} totalItems={tests.meta.total_count} page={page} setPage={setPage} />
    </main>
  );
});

Main.displayName = "Main";

export default Main;
