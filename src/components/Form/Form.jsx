import cx from "classnames";

import s from "./Form.module.scss";
import FormItem from "../FormItem";
import Input from "../Input";
import Button from "../Button";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useRef, useState } from "react";
import { createTest, fetchTestById, updateTest } from "@src/utils/testsSaga";
import { useNavigate, useParams } from "react-router-dom";
import FormOption from "../FormOption";
import { useCreateTestMutation, useGetTestByIdQuery, useUpdateTestMutation } from "@src/utils/testsApi";

const Form = ({ className }) => {
  const { id: idParam } = useParams();
  const newId = useRef(null);
  let id = idParam ?? newId.current;
  const { data: test } = useGetTestByIdQuery(id);
  const [createTest] = useCreateTestMutation();
  const [updateTest] = useUpdateTestMutation();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);

  const [typeQuestion, setTypeQuestion] = useState(0);
  const [questionText, setQuestionText] = useState("");
  const [option, setOption] = useState([]);

  const [isAddQuestion, setIsAddQuestion] = useState(false);
  const [editOption, setEditOption] = useState(null);

  const navigator = useNavigate();

  useEffect(() => {
    setTitle((prev) => (test?.title && id && !prev ? test.title : prev));
  }, [test, id]);

  const handlerCreateTest = useCallback(async () => {
    if (!id) {
      const { data } = await createTest({ title });
      newId.current = data.id;
    } else {
      const { data } = await updateTest({ id, title });
    }
  }, [title, createTest, updateTest, id]);

  const handlerAddQuestion = useCallback(() => {
    setIsAddQuestion((prev) => !prev);
    setEditOption(null);
  }, []);

  const editTask = (id) => {
    if (editOption !== null) {
      setEditOption(null);
    } else {
      setEditOption(id);
      setIsAddQuestion(false);
    }
  };

  return (
    <div className={cx(s.root, className)}>
      <form onSubmit={(e) => e.preventDefault()} className={s.form}>
        <FormItem className={s.formItem} title='Название'>
          <Input onBlur={handlerCreateTest} value={title} setValue={setTitle} placeholder={"Введите название"} className={s.input} />
        </FormItem>
        <div className={s.questions}>
          <p>Список вопросов</p>
          <input value='+' type='button' className={s.addQuestion} onClick={handlerAddQuestion} />
        </div>
        {isAddQuestion && (
          <>
            <div className={s.border} />
            <FormOption inputClassName={s.input} id={id} />
            <div className={s.border} />
          </>
        )}

        <div>
          {test?.questions?.map?.((el) => (
            <div key={el.id}>
              <div onClick={() => editTask(el.id)}>{el.title}</div>
              {editOption === el.id && isAddQuestion === false && <FormOption inputClassName={s.input} id={id} item={el} />}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Form;
