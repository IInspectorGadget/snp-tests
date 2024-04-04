import cx from "classnames";

import { memo, useEffect, useState } from "react";
import CheckBox from "@src/components/CheckBox";
import Radio from "@src/components/Radio";

import s from "./Question.module.scss";

const Question = memo(({ className, question, answers, setAnswers, questionIndex }) => {
  const [number, setNumber] = useState(answers?.[questionIndex] ? answers?.[questionIndex]?.[0] : "");
  const [currentAnswers, setCurrentAnswers] = useState(answers?.[questionIndex] ? answers?.[questionIndex] : []);

  useEffect(() => {
    setNumber(answers?.[questionIndex] ? answers?.[questionIndex]?.[0] : "");
    setCurrentAnswers(answers?.[questionIndex] ? answers?.[questionIndex] : []);
  }, [answers, questionIndex]);

  const handlerAnswerChange = (type, e, id) => {
    if (type === "number") {
      const inputValue = e.target.value;
      const filteredValue = inputValue.replace(/[^-0-9]/g, "");
      if (filteredValue) {
        setAnswers((prev) => {
          const newValue = [...prev];
          newValue[questionIndex] = [+filteredValue];
          return newValue;
        });
      } else {
        setAnswers((prev) => {
          const newValue = [...prev];
          newValue[questionIndex] = [];
          return newValue;
        });
      }
      setNumber(filteredValue);
    }
    if (type === "single") {
      setAnswers((prev) => {
        const newValue = [...prev];
        newValue[questionIndex] = [id];
        return newValue;
      });
    }
    if (type === "multiple") {
      const isTrue = e.currentTarget.checked;
      setAnswers((prev) => {
        const newValue = [...prev];
        if (isTrue) {
          if (newValue[questionIndex]) {
            newValue[questionIndex] = [...newValue[questionIndex], id];
          } else {
            newValue[questionIndex] = [id];
          }
          return newValue;
        } else {
          newValue[questionIndex] = newValue[questionIndex].filter((item) => item !== id);
          return newValue;
        }
      });
    }
  };
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
                  onChange={(e) => handlerAnswerChange(question.question_type === "multiple" ? "multiple" : "single", e, el.id)}
                />
              )}
              {question.question_type === "single" && (
                <Radio
                  name='answer'
                  isChecked={currentAnswers.find((item) => item === el.id)}
                  onClick={(e) => handlerAnswerChange(question.question_type === "multiple" ? "multiple" : "single", e, el.id)}
                />
              )}

              <span>{el.text}</span>
            </li>
          ))}
        </ul>
      )}
      {question.question_type === "number" && (
        <div className={s.numberInput}>
          <input
            type='text'
            value={number}
            placeholder='Ваш ответ'
            onChange={(e) => handlerAnswerChange(question.question_type, e)}
            className={s.input}
          />
        </div>
      )}
    </div>
  );
});

Question.displayName = "Question";

export default Question;
