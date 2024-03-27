import cx from "classnames";

import { Route, Routes } from "react-router-dom";

import s from "./Main.module.scss";
import TestsList from "../TestsList";
import Container from "../Container";
import Form from "../Form";

const Main = ({ className }) => {
  return (
    <div className={cx(s.root, className)}>
      <Container>
        <Routes>
          <Route element={<TestsList />} path='/' />
          <Route element={<Form />} path='/create' />
          <Route element={<Form />} path='/edit/:id' />
        </Routes>
      </Container>
    </div>
  );
};

export default Main;
