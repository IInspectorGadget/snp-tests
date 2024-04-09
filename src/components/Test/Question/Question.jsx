import cx from "classnames";

import { memo, useCallback, useEffect, useState } from "react";
import CheckBox from "@src/components/CheckBox";
import Radio from "@src/components/Radio";

import s from "./Question.module.scss";

const Question = memo(({ className, question, answers, setAnswers, questionIndex }) => {
  const [number, setNumber] = useState(answers?.[questionIndex]?.[0] || "");
  const [currentAnswers, setCurrentAnswers] = useState(answers?.[questionIndex] || []);

  useEffect(() => {
    setNumber(answers?.[questionIndex]?.[0] || "");
    setCurrentAnswers(answers?.[questionIndex] || []);
  }, [answers, questionIndex]);

  const handlerAnswerChange = useCallback(
    (e, id) => {
      if (question.question_type === "number") {
        const inputValue = e.target.value;
        const filteredValue = inputValue.replace(/[^-\d]/g, "");
        setAnswers((prev) => {
          const newValue = [...prev];
          newValue[questionIndex] = filteredValue ? [filteredValue] : [];
          return newValue;
        });
        setNumber(filteredValue);
      }
      if (question.question_type === "single") {
        setAnswers((prev) => {
          const newValue = [...prev];
          newValue[questionIndex] = [id];
          return newValue;
        });
      }
      if (question.question_type === "multiple") {
        const isTrue = e.currentTarget.checked;
        setAnswers((prev) => {
          const newValue = [...prev];
          if (isTrue) {
            if (newValue[questionIndex]) {
              newValue[questionIndex] = [...newValue[questionIndex], id];
            } else {
              newValue[questionIndex] = [id];
            }
          } else {
            newValue[questionIndex] = newValue[questionIndex].filter((item) => item !== id);
          }
          return newValue;
        });
      }
    },
    [questionIndex, setAnswers, question],
  );

  return (
    <div className={cx(s.root, className)}>
      <p className={s.title}>{question.title}</p>
      {(question.question_type === "multiple" || question.question_type === "single") && (
        <ul className={s.list}>
          {question.answers.map((el) => (
            <li key={el.id} className={s.item}>
              {question.question_type === "multiple" && (
                <CheckBox
                  name='answer'
                  isChecked={currentAnswers.find((item) => item === el.id)}
                  onChange={(e) => handlerAnswerChange(e, el.id)}
                />
              )}
              {question.question_type === "single" && (
                <Radio
                  name='answer'
                  isChecked={currentAnswers.find((item) => item === el.id)}
                  onChange={(e) => handlerAnswerChange(e, el.id)}
                />
              )}

              <span>{el.text}</span>
            </li>
          ))}
        </ul>
      )}
      {question.question_type === "number" && (
        <div className={s.numberInput}>
          <input type='text' value={number} placeholder='Ваш ответ' onChange={handlerAnswerChange} className={s.input} />
        </div>
      )}
    </div>
  );
});

Question.displayName = "Question";

export default Question;
