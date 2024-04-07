import cx from "classnames";

import Header from "./Header";
import Main from "./Main";
import { useSearchParams } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import { useGetTestsQuery } from "@src/utils/testsApi";
import Loader from "../Loader";

import s from "./TestsList.module.scss";

const PerPage = 8;

const TestsList = memo(({ className, userData }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filter, setFilter] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(searchParams.get("page") || 1);
  const [sort, setSort] = useState(searchParams.get("sort") || "created_at_desc");
  const {
    data: tests,
    isLoading,
    refetch,
  } = useGetTestsQuery(
    { page: page, per: PerPage, search: filter, sort: sort },
    {
      refetchOnFocus: true,
      pollingInterval: 60000,
      keepUnusedDataFor: 60000,
      skipPollingIfUnfocused: true,
      refetchOnMountOrArgChange: true,
    },
  );

  useEffect(() => {
    setSearchParams({ search: filter, page, sort });
  }, [filter, page, sort, setSearchParams]);

  return (
    <div className={cx(s.root, className)}>
      <Header refetch={refetch} setFilter={setFilter} filter={filter} setSort={setSort} />
      {!isLoading ? <Main tests={tests} userData={userData} page={page} PerPage={PerPage} setPage={setPage} /> : <Loader />}
    </div>
  );
});

TestsList.displayName = "TestList";

export default TestsList;
