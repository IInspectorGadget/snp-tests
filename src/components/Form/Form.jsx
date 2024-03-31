import cx from "classnames";

import s from "./Form.module.scss";
import FormItem from "../FormItem";
import Input from "../Input";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import FormOption from "../FormOption";
import { useCreateTestMutation, useDeleteQuestionMutation, useGetTestByIdQuery, useUpdateTestMutation } from "@src/utils/testsApi";
import editSvg from "@src/assets/edit.svg";
import deleteSvg from "@src/assets/delete.svg";
import Error from "../Error";
import checkInput from "@src/utils/checkInput";

const Form = ({ className }) => {
  const { id: idParam } = useParams();
  const newId = useRef(null);
  let id = idParam ?? newId.current;
  const { data: test, refetch } = useGetTestByIdQuery(id);
  const [createTest] = useCreateTestMutation();
  const [updateTest] = useUpdateTestMutation();
  const [deleteQuestion] = useDeleteQuestionMutation();
  const [title, setTitle] = useState("");

  const [isAddQuestion, setIsAddQuestion] = useState(false);
  const [editOption, setEditOption] = useState(null);

  const [titleError, setTitleError] = useState("");
  const [titleDirty, setTitleDirty] = useState("");

  useEffect(() => {
    setTitle((prev) => (test?.title && id && !prev ? test.title : prev));
  }, [test, id]);

  const handlerCreateTest = useCallback(async () => {
    const isCorrect = checkInput(title, true, setTitleError, setTitleDirty);
    if (isCorrect) {
      if (!id) {
        const { data } = await createTest({ title });
        newId.current = data.id;
      } else {
        updateTest({ id, title });
      }
    }
  }, [title, createTest, updateTest, id]);

  const handlerAddQuestion = useCallback(() => {
    setIsAddQuestion((prev) => !prev);
    setEditOption(null);
  }, []);

  const editQuestion = useCallback(
    (id) => {
      if (editOption === id) {
        setEditOption(null);
      } else {
        setEditOption(id);
        setIsAddQuestion(false);
      }
    },
    [editOption],
  );

  const deleteQuestions = useCallback(
    (id) => {
      deleteQuestion(id);
    },
    [deleteQuestion],
  );

  return (
    <div className={cx(s.root, className)}>
      <form onSubmit={(e) => e.preventDefault()} className={s.form}>
        <FormItem className={s.formItem} title='Название'>
          <Input onBlur={handlerCreateTest} value={title} setValue={setTitle} placeholder={"Введите название"} className={s.input} />
          <Error dirty={titleDirty} error={titleError} />
        </FormItem>
        <div className={s.questions}>
          <p>Список вопросов:</p>
          <input value='+' type='button' className={s.addQuestion} onClick={handlerAddQuestion} />
        </div>
        {isAddQuestion && (
          <>
            <div className={s.border} />
            <FormOption inputClassName={s.input} id={id} refetch={refetch} questions={test.questions} />
          </>
        )}

        <ul className={s.list}>
          <div className={s.border} />
          {test?.questions?.map?.((el, idx) => (
            <div key={el.id}>
              <li className={s.item}>
                {editOption !== el.id && (
                  <div className={s.itemShow}>
                    <div className={s.itemHeader}>
                      <p className={s.itemTitle}>
                        {idx + 1}. {el.title}
                      </p>
                      <div className={s.itemButtons}>
                        <img src={editSvg} alt='edit' className={cx(s.img, s.imgEdit)} onClick={() => editQuestion(el.id)} />
                        <img src={deleteSvg} alt='delete' className={cx(s.img, s.imgEdit)} onClick={() => deleteQuestions(el.id)} />
                      </div>
                    </div>
                    {el.answers.length > 0 && (
                      <div className={s.answers}>
                        <p>Варианты ответов:</p>

                        <ul className={s.answersList}>
                          {el.answers.map((answer) => (
                            <li className={s.answerItem} key={answer.id}>
                              <p className={cx(s.answerText, { [s.answerText_correct]: answer.is_right })}>{answer.text}</p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
                {editOption === el.id && isAddQuestion === false && (
                  <div className={s.editForm}>
                    <div className={s.itemHeader}>
                      <span className={s.itemTitle}>{idx + 1}.</span>
                      <div className={s.itemButtons}>
                        <img src={editSvg} alt='edit' className={cx(s.img, s.imgEdit, s.imgActive)} onClick={() => editQuestion(el.id)} />
                        <img src={deleteSvg} alt='delete' className={cx(s.img, s.imgEdit)} onClick={() => deleteQuestions(el.id)} />
                      </div>
                    </div>
                    <FormOption index={idx + 1} className={s.itemEdit} inputClassName={s.input} id={id} item={el} />
                  </div>
                )}
              </li>
              {idx + 1 !== test.questions.length && <div className={s.border} />}
            </div>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default Form;
