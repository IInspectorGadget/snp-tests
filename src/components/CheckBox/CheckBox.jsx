import cx from "classnames";

import s from "./CheckBox.module.scss";

const CheckBox = ({ name, id, isChecked, setIsChecked, onChange }) => {
  console.log(isChecked);
  return (
    <label className={s.label}>
      <input
        id={id}
        name={name}
        className={s.input}
        type='checkbox'
        checked={isChecked}
        onChange={(e) => {
          onChange(e);
          setIsChecked && setIsChecked(!isChecked);
        }}
      />
      <span className={cx(s.checkbox, { [s.checkboxActive]: isChecked })} aria-hidden='true' />
    </label>
  );
};

export default CheckBox;
