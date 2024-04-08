import cx from "classnames";

import { memo, useCallback, useState } from "react";

import s from "./Select.module.scss";

const Select = memo(({ className, types, type, setType }) => {
  const [value, setValue] = useState(types?.find((el) => el.type === type)?.value ?? "");
  const [isVisible, setIsVisible] = useState(false);
  const handlerChange = useCallback(
    (value, type) => {
      setType(type);
      setValue(value);
    },
    [setType],
  );

  const visibleChange = useCallback(() => setIsVisible((prev) => !prev), []);

  return (
    <div className={cx(s.root)} onClick={visibleChange}>
      <div className={className}>
        {type === "0" && <p className={s.title}>-</p>}
        {type !== "0" && <p>{value}</p>}
      </div>
      {isVisible && (
        <ul className={s.list}>
          {types.map((el, idx) => (
            <li className={s.item} onClick={() => handlerChange(el.value, el.type)} key={idx}>
              {el.value}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

Select.displayName = "Select";

export default Select;
