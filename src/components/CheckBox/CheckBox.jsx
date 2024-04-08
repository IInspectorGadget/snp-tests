import cx from "classnames";

import { useCallback } from "react";

import s from "./CheckBox.module.scss";

const CheckBox = ({ name, id, isChecked, setIsChecked, onChange }) => {
  const handlerChange = useCallback(
    (e) => {
      onChange && onChange(e);
      setIsChecked && setIsChecked(!isChecked);
    },
    [onChange, setIsChecked, isChecked],
  );
  return (
    <label className={s.label}>
      <input id={id} name={name} className={s.input} type='checkbox' checked={isChecked} onChange={handlerChange} />
      <span className={cx(s.checkbox, { [s.checkboxActive]: isChecked })} aria-hidden='true' />
    </label>
  );
};

export default CheckBox;
