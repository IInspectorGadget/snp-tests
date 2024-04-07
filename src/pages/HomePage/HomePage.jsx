import cx from "classnames";

import { memo } from "react";
import Header from "@src/components/Header";
import Main from "@src/components/Main";
import Loader from "@src/components/Loader";

import s from "./HomePage.module.scss";

const HomePage = memo(({ className, data, isLoading }) => {
  return !isLoading ? (
    <div className={cx(s.root, className)}>
      <Header userData={data} />
      <Main userData={data} />
    </div>
  ) : (
    <div className={s.loader}>
      <Loader />
    </div>
  );
});

HomePage.displayName = "HomePage";

export default HomePage;
