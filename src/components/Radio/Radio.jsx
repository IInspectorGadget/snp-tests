import cx from "classnames";

import s from "./Radio.module.scss";

const Radio = ({ name, id, isChecked, setIsChecked, onChange, onClick }) => {
  return (
    <label className={s.label}>
      <input
        id={id}
        name={name}
        className={s.input}
        type='radio'
        checked={isChecked}
        onChange={(e) => {
          onChange && onChange(e);
          setIsChecked && setIsChecked(!isChecked);
        }}
        onClick={(e) => onClick && onClick(e)}
      />
      <span className={cx(s.radio, { [s.radioActive]: isChecked })} aria-hidden='true' />
    </label>
  );
};

export default Radio;
