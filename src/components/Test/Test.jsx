import cx from "classnames";

import { useParams } from "react-router-dom";
import { useGetTestByIdQuery } from "@src/utils/testsApi";
import { memo, useCallback, useState } from "react";
import Question from "./Question";
import Result from "./Result";
import Loader from "../Loader";
import Button from "../Button";

import s from "./Test.module.scss";

const countNonEmpty = (arr) => {
  let count = 0;
  arr.forEach((element) => {
    if (element !== null && element?.length !== 0) {
      count++;
    }
  });
  return count;
};

const Test = memo(({ className }) => {
  const { id } = useParams();
  const { data: test, isSuccess, isLoading } = useGetTestByIdQuery(id);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isEnd, setIsEnd] = useState(false);

  const nextQuestion = useCallback(() => {
    if (test.questions.length !== questionIndex + 1) {
      setQuestionIndex((prev) => prev + 1);
    }
  }, [questionIndex, test]);

  const prevQuestion = useCallback(() => {
    if (questionIndex !== 0) {
      setQuestionIndex((prev) => prev - 1);
    }
  }, [questionIndex]);

  return (
    <div className={cx(s.root, className)}>
      {!isLoading ? (
        <div className={s.container}>
          {isSuccess && test.questions.length !== 0 ? (
            <>
              {!isEnd && (
                <p>
                  {questionIndex + 1}/{test.questions.length}
                </p>
              )}
              {!isEnd && (
                <Question
                  question={test.questions[questionIndex]}
                  questionIndex={questionIndex}
                  answers={answers}
                  setAnswers={setAnswers}
                />
              )}
              {!isEnd && (
                <div className={s.navigate}>
                  {questionIndex !== 0 && <Button onClick={prevQuestion} value='Назад' />}
                  {test.questions.length !== questionIndex + 1 && <Button onClick={nextQuestion} value='Вперёд' />}
                  {test.questions.length === countNonEmpty(answers) && <Button onClick={() => setIsEnd(true)} value='Завершить тест' />}
                </div>
              )}
              {isEnd && <Result test={test} answers={answers} />}
            </>
          ) : (
            <p>Пусто</p>
          )}
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
});

Test.displayName = "Test";

export default Test;
