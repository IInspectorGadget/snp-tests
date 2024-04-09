import cx from "classnames";

import { useCallback } from "react";

import s from "./Radio.module.scss";

const Radio = ({ name, id, isChecked, setIsChecked, onChange }) => {
  const handlerChange = useCallback(
    (e) => {
      onChange && onChange(e);
      setIsChecked && setIsChecked(!isChecked);
    },
    [onChange, setIsChecked, isChecked],
  );

  return (
    <label className={s.label}>
      <input id={id} name={name} className={s.input} type='radio' checked={isChecked} onChange={handlerChange} />
      <span className={cx(s.radio, { [s.radioActive]: isChecked })} aria-hidden='true' />
    </label>
  );
};

export default Radio;
