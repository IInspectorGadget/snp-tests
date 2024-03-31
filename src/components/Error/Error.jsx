import { memo } from "react";

import s from "./Error.module.scss";

const Error = memo(({ dirty, error }) => {
  return dirty && error && <div className={s.root}>*{error}</div>;
});

Error.displayName = "Error";

export default Error;
