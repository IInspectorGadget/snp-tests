import { memo, useCallback, useRef, useState } from "react";
import cx from "classnames";

import s from "./Answers.module.scss";
import Button from "../../Button";
import FormItem from "../../FormItem";
import { v4 as uuidv4 } from "uuid";
import CheckBox from "@src/components/CheckBox";

const Answers = memo(({ classInput, value, setValue, type, setUpdateValue }) => {
  const [isAnswer, setIsAnswer] = useState(false);
  const [text, setText] = useState("");

  const dragItem = useRef(null);
  const draggedOverItem = useRef(null);

  const handlerAddAnswer = useCallback(() => {
    setText("");
    setIsAnswer(false);
    const id = uuidv4();
    setValue((prev) => [
      ...prev,
      {
        id,
        text,
        is_right: isAnswer,
      },
    ]);
    setUpdateValue((prev) => [
      ...prev,
      {
        id,
        text,
        is_right: isAnswer,
        type: "create",
      },
    ]);
  }, [text, isAnswer, setText, setIsAnswer, setUpdateValue, setValue]);

  const deleteOption = (id) => {
    setValue((prev) => prev.filter((el) => el.id !== id));
    setUpdateValue((prev) => {
      let isHave = false;
      const newValue = prev.map((el) => {
        if (el.id === id && el.type === "create") {
          isHave = true;
          return { ...el, type: "none" };
        } else {
          return el;
        }
      });
      if (isHave) {
        return newValue;
      } else {
        return [...prev, { id, type: "delete" }];
      }
    });
  };

  const handlerChange = async (e, text, id) => {
    setValue((prev) =>
      prev.map((el) => {
        if (el.id === id) {
          return { ...el, is_right: !el.is_right };
        }
        return el;
      }),
    );
    setUpdateValue((prev) => {
      let isHave = false;
      let isBefore = false;
      const newValue = prev.map((el) => {
        if (el.id === id && el.type === "create") {
          isHave = true;
          return { ...el, is_right: e.target.checked };
        } else if (el.id === id && el.type === "edit") {
          isBefore = true;
          return { ...el, type: "none" };
        } else {
          return el;
        }
      });
      if (isHave) {
        return newValue;
      } else if (isBefore) {
        return [...newValue, { id, text: text, is_right: e.target.checked, type: "edit" }];
      } else {
        return [...prev, { id, text: text, is_right: e.target.checked, type: "edit" }];
      }
    });
  };

  const handlerChangeOrder = async (id) => {
    const newValue = [...value];
    const el = newValue.splice(dragItem.current, 1)[0];
    newValue.splice(draggedOverItem.current, 0, el);
    setUpdateValue((prev) => [...prev, { id, type: "move", pos: draggedOverItem.current }]);
    setValue(newValue);
  };

  return (
    <div className={cx(s.root)}>
      <div className={s.addAnswer}>
        <input
          className={classInput}
          type='text'
          value={text}
          onChange={(e) => setText(e.currentTarget.value)}
          placeholder='Введите вариант ответа'
        />
        <FormItem title='Верный ответ?' inline>
          <CheckBox isChecked={isAnswer} onChange={() => setIsAnswer((prev) => !prev)} />
        </FormItem>
        <Button type='button' onClick={() => handlerAddAnswer()} value={"Добавить вариант ответа"} />
      </div>
      {Boolean(value.length) && <p>Варианты ответа:</p>}
      {Boolean(value.length) && (
        <ul className={s.list}>
          {value.map((option, idx) => (
            <li className={s.item} key={idx}>
              <div
                className={s.itemContainer}
                draggable
                onDragStart={() => (dragItem.current = idx)}
                onDragEnter={() => (draggedOverItem.current = idx)}
                onDragEnd={() => handlerChangeOrder(option.id)}
                onDragOver={(e) => e.preventDefault()}
              >
                <span className={s.tag}>{option.text}</span>
                <div className={s.buttons}>
                  <CheckBox
                    name='answer'
                    id={option.id}
                    isChecked={option.is_right}
                    onChange={(e) => handlerChange(e, option.text, option.id)}
                  />
                  <span className={s.close} onClick={() => deleteOption(option.id)}></span>
                </div>
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
