import s from "./FormOption.module.scss";
import FormItem from "../FormItem";
import Input from "../Input";
import Answers from "../Answers";
import Button from "../Button";
import cx from "classnames";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  useCreateAnswerMutation,
  useCreateQuestionMutation,
  useDeleteAnswerMutation,
  useUpdateAnswerMutation,
  useUpdateQuestionMutation,
} from "@src/utils/testsApi";
import checkInput from "@src/utils/checkInput";
import Error from "../Error";

const checkType = (setTypeError, setTypeDirty, type) => {
  if (type === "0") {
    setTypeError("Выберите тип");
    setTypeDirty(true);
    return false;
  } else {
    setTypeDirty(false);
    return true;
  }
};

const FormOption = ({ className, inputClassName, id, item, questions }) => {
  const [newItem, setNewItem] = useState(item);
  const [questionId, setQuestionId] = useState(item?.id);
  const [title, setTitle] = useState(item?.title ?? "");
  const [answers, setAnswers] = useState(item?.answers ?? []);
  const [updateAnswers, setUpdateAnswers] = useState(item?.answers ?? []);
  const [type, setType] = useState(item?.question_type ?? "0");
  const [numberAnswer, setNumberAnswer] = useState(1);

  const [isUpdated, setIsUpdated] = useState(true);

  const [typeError, setTypeError] = useState("");
  const [typeDirty, setTypeDirty] = useState("");

  const [numberAnswerError, setNumberAnswerError] = useState("");
  const [numberAnswerDirty, setNumberAnswerDirty] = useState("");

  const [answersError, setAnswersError] = useState("");
  const [answersDirty, setAnswersDirty] = useState("");

  const [titleError, setTitleError] = useState("");
  const [titleDirty, setTitleDirty] = useState("");

  const [createQuestion] = useCreateQuestionMutation();
  const [updateQuestion] = useUpdateQuestionMutation();
  const [createAnswer] = useCreateAnswerMutation();
  const [updateAnswer] = useUpdateAnswerMutation();
  const [deleteAnswer] = useDeleteAnswerMutation();

  useEffect(() => {
    item && setNewItem(item);
  }, [item]);

  useEffect(() => {
    if (questionId && questions) {
      setNewItem(questions.find((el) => el.id === questionId));
    }
  }, [questions, questionId]);

  useEffect(() => {
    if (isUpdated) {
      setAnswers((prev) => newItem?.answers ?? prev);
      setTitle((prev) => newItem?.title ?? prev);
      setType((prev) => newItem?.question_type ?? prev);
    }
  }, [newItem, isUpdated]);

  const questionSave = (e) => {
    e.preventDefault();
  };

  const checkNumberValue = useCallback(() => {
    if (!numberAnswer.length) {
      setNumberAnswerError("Введите числовое значение");
      setNumberAnswerDirty(true);
      return false;
    } else {
      setNumberAnswerDirty(false);
      return true;
    }
  }, [numberAnswer]);

  const checkAnswers = useCallback(() => {
    const count = answers.filter((obj) => obj.is_right === true).length;
    if (answers.length < 2) {
      setAnswersError("Вопрос не может содержать менее 2 вариантов ответа");
      setAnswersDirty(true);
      return false;
    }
    if (type === "single") {
      if (count !== 1) {
        setAnswersError("Вопрос должен содержать только один правильный ответ");
        setAnswersDirty(true);
        return false;
      } else {
        setAnswersDirty(false);
        return true;
      }
    } else if (type === "multiple") {
      if (!count) {
        setAnswersError("Вопрос должен содержать хотя бы один правильный ответ");
        setAnswersDirty(true);
        return false;
      } else {
        setAnswersDirty(false);
        return true;
      }
    }
    setAnswersDirty(false);
    return true;
  }, [answers, type]);

  const handlerCreateQuestion = useCallback(async () => {
    const isTitleCorrect = checkInput(title, true, setTitleError, setTitleDirty);
    const isTypeCorrect = checkType(setTypeError, setTypeDirty, type);
    const isNumberValueCorrect = type === "number" ? checkNumberValue() : true;
    const isAnswerCorrect = checkAnswers();
    console.log(isNumberValueCorrect, isTitleCorrect, isTypeCorrect, isAnswerCorrect);
    if (isNumberValueCorrect && isTitleCorrect && isTypeCorrect && isAnswerCorrect) {
      setIsUpdated(false);
      const params = { test_id: id, title, question_type: type, answer: numberAnswer };
      if (!questionId) {
        const { data } = await createQuestion(params);
        setQuestionId(data.id);
        for (const { text, is_right } of answers) {
          await createAnswer({ questionId: data.id, text, is_right, testId: id });
        }
      } else {
        updateQuestion({ id: questionId, ...params });
        console.log(updateAnswers);
        for (const { text, is_right, id: answerId, type } of updateAnswers) {
          if (type === "delete") {
            deleteAnswer({ id: answerId, textId: id });
          } else if (type === "create") {
            await createAnswer({ questionId, text, is_right, testId: id });
          } else if (type === "edit") {
            updateAnswer({ id: answerId, textId: id, text, is_right });
          }
          setUpdateAnswers([]);
        }
      }
      setIsUpdated(true);
    }
  }, [
    checkAnswers,
    createQuestion,
    updateQuestion,
    checkNumberValue,
    deleteAnswer,
    updateAnswer,
    updateAnswers,
    createAnswer,
    answers,
    id,
    title,
    type,
    numberAnswer,
    questionId,
  ]);

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
        <Input
          value={title}
          setValue={setTitle}
          className={inputClassName}
          onBlur={() => checkInput(title, true, setTitleError, setTitleDirty)}
        />
        <Error dirty={titleDirty} error={titleError} />
      </FormItem>
      {type === "number" && (
        <FormItem title='Введите численный ответа'>
          <Input type='number' className={inputClassName} value={numberAnswer} setValue={setNumberAnswer} />
          <Error dirty={numberAnswerDirty} error={numberAnswerError} />
        </FormItem>
      )}

      {(type === "single" || type === "multiple") && (
        <FormItem title='Введите варианты ответа'>
          <Answers
            type='checkbox'
            classInput={inputClassName}
            testId={id}
            questionId={questionId}
            value={answers}
            setValue={setAnswers}
            setUpdateValue={setUpdateAnswers}
          />
        </FormItem>
      )}

      <div>
        <Button type='button' onClick={() => handlerCreateQuestion(id)} value={questionId ? "Сохранить вопрос" : "Добавить вопрос"} />
      </div>
    </div>
  );
};

export default FormOption;
