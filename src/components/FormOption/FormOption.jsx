import s from "./FormOption.module.scss";
import FormItem from "../FormItem";
import Input from "../Input";
import Answers from "../Answers";
import Button from "../Button";
import cx from "classnames";
import { useCallback, useEffect, useState } from "react";
import { useCreateQuestionMutation, useUpdateQuestionMutation } from "@src/utils/testsApi";
import checkInput from "@src/utils/checkInput";
import Error from "../Error";

const checkType = (setTypeError, setTypeDirty, type) => {
  if (type === 0) {
    setTypeError("Выберите тип");
    setTypeDirty(true);
    return false;
  } else {
    setTypeDirty(false);
  }
};

const FormOption = ({ className, inputClassName, id, item, questions }) => {
  const [newItem, setNewItem] = useState(item);
  const [questionId, setQuestionId] = useState(item?.id);
  const [title, setTitle] = useState(item?.title ?? "");
  const [answers, setAnswers] = useState(item?.answers ?? []);
  const [type, setType] = useState(item?.question_type ?? "0");
  const [numberAnswer, setNumberAnswer] = useState(1);

  const [typeError, setTypeError] = useState("");
  const [typeDirty, setTypeDirty] = useState("");
  const [numberAnswerError, setNumberAnswerError] = useState("");
  const [numberAnswerDirty, setNumberAnswerDirty] = useState("");
  const [titleError, setTitleError] = useState("");
  const [titleDirty, setTitleDirty] = useState("");

  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();

  useEffect(() => {
    item && setNewItem(item);
  }, [item]);

  useEffect(() => {
    if (questionId && questions) {
      setNewItem(questions.find((el) => el.id === questionId));
    }
  }, [questions, questionId]);

  useEffect(() => {
    setAnswers((prev) => newItem?.answers ?? prev);
    setTitle((prev) => newItem?.title ?? prev);
    setType((prev) => newItem?.question_type ?? prev);
  }, [newItem]);

  const questionSave = (e) => {
    e.preventDefault();
  };

  const handlerCreateQuestion = useCallback(async () => {
    const isTitleCorrect = checkInput(title, true, setTitleError, setTitleDirty);
    const isTypeCorrect = checkType(setTypeError, setTypeDirty, type);
    console.log(type);
    const isNumberValueCorrect = () => {
      if (!numberAnswer.length) {
        setNumberAnswerError("Введите числовое значение");
        setNumberAnswerDirty(true);
        return false;
      } else {
        setNumberAnswerDirty(false);
      }
      return true;
    };
    if (isNumberValueCorrect() && isTitleCorrect && isTypeCorrect) {
      const params = { test_id: id, title, question_type: type, answer: numberAnswer };
      if (!questionId) {
        const { data } = await createQuestion(params);
        setQuestionId(data.id);
      } else {
        updateQuestion({ id: questionId, ...params });
      }
    }
  }, [createQuestion, updateQuestion, id, title, type, numberAnswer, questionId]);

  const handlerTypeChange = (e) => {
    setType(e.currentTarget.value);
  };

  return (
    <div className={cx(className, s.root)}>
      <FormItem title='Выберите тип вопроса'>
        <select value={type} className={s.input} onChange={handlerTypeChange}>
          <option value='0' disabled>
            Выберите
          </option>
          <option value={"single"}>Один из списка</option>
          <option value={"multiple"}>Несколько из списка</option>
          <option value={"number"}>Численный ответ</option>
        </select>
        <Error dirty={typeDirty} error={typeError} />
      </FormItem>
      <FormItem title='Введите текст вопроса'>
        <Input value={title} setValue={setTitle} className={inputClassName} />
        <Error dirty={titleDirty} error={titleError} />
      </FormItem>
      {type === "number" && (
        <FormItem title='Введите численный ответа'>
          <Input type='number' className={inputClassName} value={numberAnswer} setValue={setNumberAnswer} />
          <Error dirty={numberAnswerDirty} error={numberAnswerError} />
        </FormItem>
      )}
      {!questionId && (
        <div>
          <Button type='button' onClick={() => handlerCreateQuestion(id)} value={questionId ? "Сохранить вопрос" : "Добавить вопрос"} />
        </div>
      )}
      {questionId && type === "single" && (
        <FormItem title='Введите варианты ответа'>
          <Answers type='checkbox' classInput={inputClassName} testId={id} questionId={questionId} value={answers} setValue={setAnswers} />
        </FormItem>
      )}
      {questionId && type === "multiple" && (
        <>
          <FormItem title='Введите варианты ответа'>
            <Answers
              type='checkbox'
              classInput={inputClassName}
              testId={id}
              questionId={questionId}
              value={answers}
              setValue={setAnswers}
            />
          </FormItem>
        </>
      )}

      {type !== 0 && (
        <div>
          <Button type='button' onClick={(e) => questionSave(e, 1)} value={"Завершить"} />
        </div>
      )}
    </div>
  );
};

export default FormOption;
