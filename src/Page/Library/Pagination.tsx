// src/components/common/Pagination.tsx
import tw from "@/utils/tw";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

function Pagination({ currentPage, totalPages, onPageChange, }: PaginationProps) {
  const renderPageAnchors = () => {
    const anchors = [];
    for (let i = -2; i <= 2; i++) {
      const pageNum = currentPage + i;
      if (pageNum > 0 && pageNum <= totalPages) {
        anchors.push(
          <button
            className={tw(
              "cursor-pointer px-2",
              pageNum === currentPage && "font-semibold text-primary"
            )}
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        );
      }
    }
    return anchors;
  };

  return (
    <nav className="mt-12 mb-12 flex items-center gap-2 justify-center">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="cursor-pointer px-2 disabled:text-black"
      >
        &lt; 이전
      </button>

      <span className="flex gap-2">{renderPageAnchors()}</span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="cursor-pointer px-2 disabled:text-black"
      >
        다음 &gt;
      </button>
          </nav>
        );
      }

export default Pagination;
