import s from "./FormOption.module.scss";
import FormItem from "../FormItem";
import Input from "../Input";
import Answers from "../Answers";
import Button from "../Button";
import { useCallback, useRef, useState } from "react";
import { useCreateAnswerMutation, useCreateQuestionMutation } from "@src/utils/testsApi";

const FormOption = ({ inputClassName, id, item }) => {
  const questionId = useRef(null);
  const [title, setTitle] = useState(item?.title ?? "");
  const [answers, setAnswers] = useState(item?.answers ?? []);
  const [type, setType] = useState(item?.question_type ?? "0");
  const [countCorrectAnswers, setCountCorrectAnswers] = useState(1);

  const [createQuestion] = useCreateQuestionMutation();
  const [createAnswer] = useCreateAnswerMutation();

  const questionSave = (e) => {
    e.preventDefault();
  };

  const handlerCreateQuestion = useCallback(async () => {
    if (!questionId.current) {
      const data = await createQuestion({ test_id: id, title, question_type: type, answer: countCorrectAnswers });
      console.log(data);
    }
  }, [createQuestion, id, title, type, countCorrectAnswers]);

  const handlerTypeChange = (e) => {
    setType(e.currentTarget.value);
    setAnswers((prev) =>
      prev.map((item) => {
        return { ...item, isCorrect: false };
      }),
    );
  };

  return (
    <div className={s.root}>
      <FormItem title='Выберите тип вопроса'>
        <select value={type} className={s.input} onChange={handlerTypeChange}>
          <option value='0' disabled>
            Выберите
          </option>
          <option value={"single"}>Один из списка</option>
          <option value={"multiple"}>Несколько из списка</option>
          <option value={"number"}>Численный ответ</option>
        </select>
      </FormItem>
      <FormItem title='Введите текст вопроса'>
        <Input value={title} setValue={setTitle} className={inputClassName} />
      </FormItem>
      {type === "multiple" && (
        <FormItem title='Введите кол-во правильных ответов'>
          <Input type='number' className={inputClassName} value={countCorrectAnswers} setValue={setCountCorrectAnswers} />
        </FormItem>
      )}
      <div>
        <Button type='button' onClick={() => handlerCreateQuestion(id)} value={"Добавить вопрос"} />
      </div>
      {type === "single" && (
        <FormItem title='Введите варианты ответа'>
          <Answers type='radio' classInput={inputClassName} value={answers} setValue={setAnswers} />
        </FormItem>
      )}
      {type === "multiple" && (
        <>
          <FormItem title='Введите варианты ответа'>
            <Answers type='checkbox' classInput={inputClassName} value={answers} setValue={setAnswers} />
          </FormItem>
        </>
      )}
      {type === "number" && 3}
      {type !== 0 && (
        <div>
          <Button type='button' onClick={(e) => questionSave(e, 1)} value={"Завершить"} />
        </div>
      )}
    </div>
  );
};

export default FormOption;
