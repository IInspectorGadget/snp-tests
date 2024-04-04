import cx from "classnames";

import s from "./Result.module.scss";

const Result = ({ className, test, answers }) => {
  const getResult = () => {
    const result = test.questions.reduce(
      (count, question, index) => {
        const correctAnswers =
          question.question_type !== "number"
            ? question.answers.filter((answer) => answer.is_right).map((answer) => answer.id)
            : [question.answer];
        const userQuestionAnswers = answers[index];
        if (
          correctAnswers.length === userQuestionAnswers.length &&
          correctAnswers.every((correctAnswer) => userQuestionAnswers.includes(correctAnswer))
        ) {
          return +count + 1;
        } else {
          return +count;
        }
      },
      [0],
    );
    return result;
  };

  return (
    <div className={cx(s.root, className)}>
      <div className={s.correctAnswers}>
        <p className={s.correctAnswersTitle}>Результат</p>
        {getResult()} / {test.questions.length}
      </div>
      <ul className={s.list}>
        <div className={s.border} />
        {test.questions.map((question, idx) => (
          <div key={question.id}>
            <li className={s.item}>
              <p className={s.number}>{idx + 1}.</p>
              <div className={s.question}>
                <p className={s.title}>{question.title}</p>
                <ul>
                  {question.question_type === "number" && (
                    <>
                      <p
                        className={cx(s.numberAnswer, {
                          [s.answerCorrect]: question.answer === +answers[idx],
                          [s.answerFailed]: question.answer !== +answers[idx],
                        })}
                      >
                        Ваш ответ: {answers[idx]}
                      </p>
                      <p className={cx(s.numberAnswer)}>Верный ответ: {question.answer}</p>
                    </>
                  )}
                  {question.question_type !== "number" &&
                    question.answers.map((answer) => {
                      const myAnswer = answers[idx].find((item) => item === answer.id);
                      return (
                        <li
                          key={answer.id}
                          className={cx(s.answer, {
                            [s.answerCorrect]: myAnswer && answer.is_right,
                            [s.answerFailed]: myAnswer && !answer.is_right,
                            [s.answerRight]: answer.is_right,
                          })}
                        >
                          {answer.text}
                        </li>
                      );
                    })}
                </ul>
              </div>
            </li>
            <div className={s.border} />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default Result;
