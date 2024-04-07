import cx from "classnames";

import FormItem from "../../FormItem";
import Input from "@src/components/Input";
import Answers from "../Answers";
import Button from "@src/components/Button";
import { memo, useCallback, useEffect, useState } from "react";
import {
  useCreateAnswerMutation,
  useCreateQuestionMutation,
  useDeleteAnswerMutation,
  useMoveAnswerMutation,
  useUpdateAnswerMutation,
  useUpdateQuestionMutation,
} from "@src/utils/testsApi";
import checkInput from "@src/utils/checkInput";
import Error from "@src/components/Error";
import Modal from "@src/components/Modal";
import Select from "@src/components/Select";

import s from "./FormOption.module.scss";

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

const FormOption = memo(({ className, inputClassName, id, item, questions, refetch }) => {
  const [newItem, setNewItem] = useState(item);
  const [questionId, setQuestionId] = useState(item?.id);
  const [title, setTitle] = useState(item?.title ?? "");
  const [answers, setAnswers] = useState(item?.answers ?? []);
  const [updateAnswers, setUpdateAnswers] = useState(item?.answers ?? []);
  const [type, setType] = useState(item?.question_type ?? "0");
  const [numberAnswer, setNumberAnswer] = useState("1");

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
  const [moveAnswer] = useMoveAnswerMutation();

  const [isVisible, setIsVisible] = useState(false);

  const closeModal = useCallback(() => {
    setIsVisible(false);
  }, [setIsVisible]);

  const showModal = useCallback(() => {
    setIsVisible(true);
  }, []);

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
    if (answers.length < 2 && type !== "number") {
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
    } else if (type === "number") {
      if (typeof +numberAnswer === "number") {
        setAnswersDirty(false);
        return true;
      } else {
        setAnswersError("Ответ должен быть числом");
        setAnswersDirty(true);
        return false;
      }
    }
    setAnswersDirty(false);
    return true;
  }, [answers, type, numberAnswer]);

  const createNewQuestion = useCallback(async () => {
    const isTitleCorrect = checkInput(title, true, setTitleError, setTitleDirty);
    const isTypeCorrect = checkType(setTypeError, setTypeDirty, type);
    const isNumberValueCorrect = type === "number" ? checkNumberValue() : true;
    const isAnswerCorrect = checkAnswers();
    if (isNumberValueCorrect && isTitleCorrect && isTypeCorrect && isAnswerCorrect) {
      const params = { testId: id, title, question_type: type, answer: numberAnswer };
      if (!questionId) {
        const { data } = await createQuestion(params);
        setQuestionId(null);
        setNewItem(null);
        setTitle("");
        setAnswers([]);
        setUpdateAnswers([]);
        setType("0");
        setNumberAnswer("1");
        for (const { text, is_right } of answers) {
          await createAnswer({ questionId: data.id, text, is_right, testId: id });
        }
      } else {
        updateQuestion({ id: questionId, ...params });
        let newId = {};
        for (const { text, is_right, id: answerId, type } of updateAnswers) {
          if (type === "create") {
            const { data } = await createAnswer({ questionId, text, is_right, testId: id });
            updateAnswers.forEach((el) => {
              if (el.id === answerId) {
                newId = { ...newId, [el.id]: data.id };
              }
            });
          } else if (type === "delete") {
            await deleteAnswer({ id: answerId, textId: id });
          }
        }
        const newUpdateValue = updateAnswers.map((el) => {
          if (newId[el.id]) {
            return { ...el, id: newId[el.id] };
          } else {
            return el;
          }
        });
        for (const { text, is_right, id: answerId, type, pos } of newUpdateValue) {
          if (type === "edit") {
            await updateAnswer({ id: answerId, testId: id, text, is_right });
          } else if (type === "move") {
            await moveAnswer({ id: answerId, position: pos, testId: id });
          }
        }
      }

      setUpdateAnswers([]);
      refetch(id);
    }
  }, [
    refetch,
    checkAnswers,
    createQuestion,
    updateQuestion,
    moveAnswer,
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

  const handlerSave = useCallback(() => {
    createNewQuestion();
    closeModal();
  }, [createNewQuestion, closeModal]);

  return (
    <div className={cx(className, s.root)}>
      <FormItem title='Выберите тип вопроса'>
        <Select
          className={s.input}
          types={[
            { type: "single", value: "один из списка" },
            { type: "multiple", value: "Несколько из списка" },
            { type: "number", value: "Численный ответ" },
          ]}
          setType={setType}
          type={type}
        />

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
          <Error dirty={answersDirty} error={answersError} />
        </FormItem>
      )}

      <div>
        <Button type='button' onClick={showModal} value={questionId ? "Сохранить вопрос" : "Добавить вопрос"} />
      </div>
      {isVisible && (
        <Modal isVisible={isVisible} closeModal={closeModal} title={questionId ? "Сохранение" : "Добавление"}>
          <div>
            <p className={s.modalText}>Вы уверены что {questionId ? "сохранить" : "добавить"} вопрос</p>
            <div className={s.modalButtons}>
              <Button value='Да' type='button' onClick={handlerSave} />
              <Button value='Нет' type='button' onClick={closeModal} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
});

FormOption.displayName = "FormOption";

export default FormOption;
