import cx from "classnames";

import s from "./TestsList.module.scss";
import Header from "./Header";
import Main from "./Main";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

const TestsList = ({ className }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("search") || "");

  useEffect(() => {
    if (filter) {
      setSearchParams({ search: filter });
    } else {
      setSearchParams("");
    }
  }, [filter, setSearchParams]);

  return (
    <div className={cx(s.root, className)}>
      <div>
        <Header setFilter={setFilter} filter={filter} />
        <Main filter={filter} />
      </div>
    </div>
  );
};

export default TestsList;
