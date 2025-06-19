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

  const canGoPrev = page > 1 && totalPages > 0;
  const canGoNext = page < totalPages && totalPages > 0;

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        {rangeStart}-{rangeEnd} out of {total} rows
      </div>
      <div className="pagination">
        <button
          onClick={() => canGoPrev && handlePageChange(page - 1)}
          disabled={!canGoPrev}
        >
          <IoIosArrowBack />
        </button>

        {pages}

        <button
          onClick={() => canGoNext && handlePageChange(page + 1)}
          disabled={!canGoNext}
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
}
