import cx from "classnames";

import s from "./Main.module.scss";
import { Route, Routes } from "react-router-dom";
import TestsList from "../TestsList";
import Container from "../Container";

const Main = ({ className }) => {
  return (
    <div className={cx(s.root, className)}>
      <Container>
        <Routes>
          <Route element={<TestsList />} path='/' />
        </Routes>
      </Container>
    </div>
  );
};

export default Main;
