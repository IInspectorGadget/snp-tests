import cx from "classnames";

import Header from "@src/components/Header";
import Main from "@src/components/Main";

import s from "./HomePage.module.scss";

const HomePage = ({ className }) => {
  return (
    <div className={cx(s.root, className)}>
      <Header />
      <Main />
    </div>
  );
};

export default HomePage;
