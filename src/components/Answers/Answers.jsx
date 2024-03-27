import { memo, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import cx from "classnames";

import s from "./Answers.module.scss";

const Answers = memo(({ classInput, value, setValue, type }) => {
  const addOption = useCallback(
    (e) => {
      const target = e.currentTarget;
      const text = target.value.trim();
      if (e.key === "Enter" && text) {
        setValue((prev) => {
          const newTags = [
            ...prev,
            {
              id: uuidv4(),
              text,
              isCorrect: false,
            },
          ];
          return newTags;
        });
        target.value = "";
      }
    },
    [setValue],
  );

  const deleteOption = useCallback(
    (id) => {
      setValue((prev) => {
        const newTags = prev.filter((item) => item.id !== id);
        return newTags;
      });
    },
    [setValue],
  );

  const handlerChange = (e) => {
    const id = e.currentTarget.id;
    setValue((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, isCorrect: e.target.checked };
        } else {
          if (type === "radio") {
            return { ...item, isCorrect: false };
          } else {
            return item;
          }
        }
      }),
    );
  };

  return (
    <div className={cx(s.root)}>
      <input className={classInput} type='text' placeholder='Нажмите enter для добавления' onKeyUp={addOption} />
      <p>Варианты ответа:</p>
      {Boolean(value.length) && (
        <ul className={s.list}>
          {value.map((option, idx) => (
            <li className={s.item} key={idx}>
              <span className={s.tag}>{option.text}</span>
              <div className={s.buttons}>
                <input name='answer' checked={option.isCorrect} id={option.id} type={type} onChange={(e) => handlerChange(e)} />
                <span className={s.close} onClick={() => deleteOption(option.id)}></span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

Answers.displayName = "Answers";

export default Answers;
