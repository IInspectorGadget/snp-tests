import cx from "classnames";

import { memo } from "react";

import s from "./Button.module.scss";

const Button = memo(({ className, value, type = "button", onClick, isDisabled = false }) => {
  return <input disabled={isDisabled} onClick={onClick} value={value} type={type} className={cx(className, s.root)} />;
});

Button.displayName = "Button";

export default Button;
