import cx from "classnames";

import { memo } from "react";
import { Route, Routes } from "react-router-dom";
import TestsList from "../TestsList";
import Container from "../Container";
import Form from "../Form";
import Test from "../Test";
import AdminRoute from "@src/utils/AdminRoute";

import s from "./Main.module.scss";

const Main = memo(({ className, userData }) => {
  return (
    <div className={cx(s.root, className)}>
      <Container>
        <Routes>
          <Route element={<TestsList userData={userData} />} path='/' />
          <Route element={<AdminRoute isAdmin={userData?.is_admin} />}>
            <Route element={<Form />} path='/create' />
          </Route>
          <Route element={<AdminRoute isAdmin={userData?.is_admin} />}>
            <Route element={<Form />} path='/edit/:id' />
          </Route>
          <Route element={<Test />} path='/passing/:id' />
        </Routes>
      </Container>
    </div>
  );
});

Main.displayName = "Main";

export default Main;
