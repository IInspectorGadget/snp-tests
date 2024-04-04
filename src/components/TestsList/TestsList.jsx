import cx from "classnames";

import Header from "./Header";
import Main from "./Main";
import { useSearchParams } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useGetTestsQuery } from "@src/utils/testsApi";
import Loader from "../Loader";

import s from "./TestsList.module.scss";

const TestsList = memo(({ className, userData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState("created_at_desc");
  const { data: tests, isLoading, refetch } = useGetTestsQuery({ page: page, per: 8, search: filter, sort: sort });

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
        <Header refetch={refetch} setFilter={setFilter} filter={filter} setSort={setSort} />
      </div>
      {!isLoading ? <Main tests={tests} userData={userData} page={page} setPage={setPage} /> : <Loader />}
    </div>
  );
});

TestsList.displayName = "TestList";

export default TestsList;
