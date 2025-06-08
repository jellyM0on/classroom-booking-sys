import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function Pagination({
  page,
  totalPages,
  pageSize,
  total,
  handlePageChange,
}) {
  const pageWindow = 3;
  const halfWindow = Math.floor(pageWindow / 2);

  let start = Math.max(1, page - halfWindow);
  let end = start + pageWindow - 1;

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, end - pageWindow + 1);
  }

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(
      <button
        key={i}
        onClick={() => handlePageChange(i)}
        className={i === page ? "active" : ""}
      >
        {i}
      </button>
    );
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {rangeStart}-{rangeEnd} out of {total} rows
      </div>
      <div className="pagination">
        <button
          onClick={() => handlePageChange(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <IoIosArrowBack />
        </button>

        {pages}

        <button
          onClick={() => handlePageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}
