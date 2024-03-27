import { memo } from "react";
import cx from "classnames";

import s from "./FormItem.module.scss";

const FormItem = memo(({ className, children, title }) => {
  return (
    <div className={cx(className, s.root)}>
      {Boolean(title) && <span className={s.label}>{title}</span>}
      {children}
    </div>
  );
});

FormItem.displayName = "FormItem";

export default FormItem;
