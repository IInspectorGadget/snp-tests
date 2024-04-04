import cx from "classnames";

import { memo } from "react";

import s from "./Loader.module.scss";

const Loader = memo(({ className }) => {
  return <div className={cx(s.root, className)}></div>;
});

Loader.displayName = "Loader";

export default Loader;
