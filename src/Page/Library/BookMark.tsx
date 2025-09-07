import { useEffect, useState } from "react";
import { getBookmarks, type BookmarkBook } from "@/utils/getBookmarks";
import { useAuthStore } from "@/store/useAuthStore";
import Pagination from "./Pagination";
import { getBookImageURLs } from "@/utils/bookImageUtils";
import { useNavigate, createSearchParams } from "react-router-dom";
import { showConfirmAlert } from "@/utils/confirmAlert";

function BookMark() {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<BookmarkBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(bookmarks.length / itemsPerPage);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookmarks = async () => {
      setLoading(true);
      try {
        const data = await getBookmarks(user.id);
        setBookmarks(data);
      } catch (err) {
        console.error("북마크 가져오기 실패:", err);
        setBookmarks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user?.id]);

if (loading) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p>Loading...</p>
    </div>
  );
}

if (!bookmarks.length) {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <p className="text-gray-500 text-lg">북마크한 책이 없습니다.</p>
    </div>
  );
}

  const paginatedBookmarks = bookmarks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 경고창 + 이동 처리
  const handleGoDetail = (isbn13: string) => {
    showConfirmAlert({
      title: "도서 페이지로 이동하시겠습니까?",
      text: "해당 도서 상세페이지로 이동합니다.",
      confirmText: "네, 이동합니다",
      cancelText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        navigate({
          pathname: "/book_detail",
          search: createSearchParams({ isbn13 }).toString(),
        });
      }
    });
  };

  return (
    <div className="max-w-[1200px] mx-auto mt-18">
      <div className="text-base font-bold mb-6">My Book List</div>

      {/* 책 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mt-8">
        {paginatedBookmarks.map((book, index) => {
          const isbn13 = book.isbn13 ?? null;
          const imageUrl = getBookImageURLs(isbn13 ?? "")[0] ?? undefined;

          return (
            <div
              key={isbn13 || `bookmark-${index}`}
              className="flex flex-col items-start max-w-41"
            >
              <img
                src={imageUrl}
                alt={book.book_name || "book cover"}
                className="w-full max-h-60 mt-8 aspect-[2/3] object-cover rounded-xl shadow-xl cursor-pointer"
                onClick={() => isbn13 && handleGoDetail(isbn13)}
              />
            </div>
          );
        })}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default BookMark;
