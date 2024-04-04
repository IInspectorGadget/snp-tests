import cx from "classnames";

import { memo } from "react";

import s from "./Pagination.module.scss";

const Pagination = memo(({ className, itemsPerPage, totalItems, page, setPage }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setPage(page);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(1, page - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2) {
      startPage = Math.max(1, endPage - 2);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button className={s.button} key={i} onClick={() => goToPage(i)}>
          {i}
        </button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className={cx(s.root, className)}>
      <div className={s.buttons}>{renderPageNumbers()}</div>
    </div>
  );
});

Pagination.displayName = "Pagination";

export default Pagination;
