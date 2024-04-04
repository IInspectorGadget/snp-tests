import cx from "classnames";

import { memo, useCallback } from "react";

import s from "./Input.module.scss";

const Input = memo(
  ({
    className,
    onBlur,
    type = "text",
    placeholder,
    name,
    id,
    maxLength,
    isRequired = true,
    value,
    setValue,
    setDirty,
    setError,
    checkErrors,
  }) => {
    const handlerBlur = useCallback(() => {
      onBlur && onBlur();
      type !== "number" && setValue((prev) => prev.trim());
      checkErrors && checkErrors(type, type !== "number" ? value.trim() : value, maxLength, isRequired, setError, setDirty);
    }, [checkErrors, onBlur, isRequired, maxLength, setDirty, setError, setValue, type, value]);

    const handlerChange = useCallback(
      (e) => {
        const target = e.currentTarget;
        const value = target.value.slice(0, maxLength);
        setValue(value);
      },
      [maxLength, setValue],
    );

    return (
      <input
        id={id}
        name={name}
        type={type}
        onChange={handlerChange}
        onBlur={handlerBlur}
        value={value}
        autoComplete='on'
        className={cx(className, s.root, { [s.date]: type === "date" })}
        placeholder={placeholder}
      />
    );
  },
);

Input.displayName = "Input";

export default Input;
