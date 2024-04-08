import cx from "classnames";

import { memo } from "react";

import s from "./Loader.module.scss";

const Loader = memo(({ className }) => <div className={cx(s.root, className)} />);

Loader.displayName = "Loader";

export default Loader;
