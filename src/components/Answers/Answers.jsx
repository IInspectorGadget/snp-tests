import { memo, useCallback, useRef } from "react";
import cx from "classnames";

import s from "./Answers.module.scss";
import { useCreateAnswerMutation, useDeleteAnswerMutation, useMoveAnswerMutation, useUpdateAnswerMutation } from "@src/utils/testsApi";

const Answers = memo(({ classInput, testId, questionId, value, setValue, type }) => {
  const [createAnswer] = useCreateAnswerMutation();
  const [updateAnswer] = useUpdateAnswerMutation();
  const [deleteAnswer] = useDeleteAnswerMutation();
  const [moveAnswer] = useMoveAnswerMutation();

  const dragItem = useRef(null);
  const draggedOverItem = useRef(null);

  const addOption = useCallback(
    async (e) => {
      const target = e.currentTarget;
      const text = target.value.trim();
      if (e.key === "Enter" && text) {
        target.value = "";
        const { data } = await createAnswer({ questionId, text, testId });
        setValue((prev) => [...prev, data]);
      }
    },
    [createAnswer, questionId, testId, setValue],
  );

  const deleteOption = useCallback(
    (id) => {
      deleteAnswer({ id, testId });
    },
    [deleteAnswer, testId],
  );

  const handlerChange = async (e, text, id) => {
    setValue((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return { ...el, is_right: !el.is_right };
        }
        return el;
      }),
    );
    updateAnswer({ id, text: text, is_right: e.target.checked });
  };

  const handlerChangeOrder = (id) => {
    console.log(value);
    const newValue = [...value];
    [newValue[dragItem.current], newValue[draggedOverItem.current]] = [newValue[draggedOverItem.current], newValue[dragItem.current]];
    moveAnswer({ id, position: draggedOverItem.current, testId });
    setValue(newValue);
  };

  return (
    <div className={cx(s.root)}>
      <input className={classInput} type='text' placeholder='Нажмите Enter для добавления' onKeyUp={addOption} />
      {Boolean(value.length) && <p>Варианты ответа:</p>}
      {Boolean(value.length) && (
        <ul className={s.list}>
          {value.map((option, idx) => (
            <li
              className={s.item}
              key={idx}
              draggable
              onDragStart={() => (dragItem.current = idx)}
              onDragEnter={() => (draggedOverItem.current = idx)}
              onDragEnd={() => handlerChangeOrder(option.id)}
              onDragOver={(e) => e.preventDefault()}
            >
              <span className={s.tag}>{option.text}</span>
              <div className={s.buttons}>
                <input
                  name='answer'
                  checked={option.is_right}
                  id={option.id}
                  type={type}
                  onChange={(e) => handlerChange(e, option.text, option.id)}
                />
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
