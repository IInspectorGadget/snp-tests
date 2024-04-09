import { memo, useCallback, useEffect } from "react";

import s from "./Modal.module.scss";

const stopEventPropagation = (e) => e.stopPropagation();

const Modal = memo(({ closeModal, children, title }) => {
  const closeModalOnEsc = useCallback(
    (e) => {
      if (e.keyCode === 27) {
        closeModal();
      }
    },
    [closeModal],
  );

  useEffect(() => {
    document.addEventListener("keydown", closeModalOnEsc);
    return () => {
      document.removeEventListener("keydown", closeModalOnEsc);
    };
  }, [closeModal, closeModalOnEsc]);

  return (
    <div className={s.root} onClick={closeModal}>
      <div className={s.wrapper} onClick={stopEventPropagation}>
        <div className={s.close} onClick={closeModal} />
        <p className={s.title}>{title}</p>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = "Modal";

export default Modal;
