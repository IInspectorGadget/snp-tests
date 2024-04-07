import cx from "classnames";

import { memo } from "react";

import s from "./Container.module.scss";

const Container = memo(({ className, children }) => {
  return <div className={cx(s.root, className)}>{children}</div>;
});

Container.displayName = "Container";

export default Container;
