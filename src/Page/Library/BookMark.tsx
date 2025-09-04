

import { useEffect, useState } from "react";
import { getBookmarks, type BookmarkBook } from "@/utils/getBookmarks";
import { useAuthStore } from "@/store/useAuthStore";
import Pagination from "./Pagination"; 

function BookMark() {
  const { user } = useAuthStore();
  const [bookmarks, setBookmarks] = useState<BookmarkBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(bookmarks.length / itemsPerPage);

  useEffect(() => {
    if (!user?.id) return;

    const fetchBookmarks = async () => {
      setLoading(true);
      const data = await getBookmarks(user.id);
      setBookmarks(data);
      setLoading(false);
    };

    fetchBookmarks();
  }, [user?.id]);

  if (loading) return <p>Loading...</p>;
  if (!bookmarks.length) return <p>북마크한 책이 없습니다.</p>;

  const paginatedBookmarks = bookmarks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-[1200px] mx-auto mt-18">
      <div className="text-base font-bold mb-6">My Book List</div>
      {/* 책 목록 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mt-8">
        {paginatedBookmarks.map((book) => (
          <div
            key={book.bookmark_id}
            className="flex flex-col items-start max-w-41 "
          >
            {/* 이미지 */}
            <img
              src={book.image_url ?? undefined}
              alt={book.book_name ?? undefined}
              className="w-full max-h-60 mt-8 aspect-[2/3] object-cover rounded-xl shadow-xl"
            />
            {/* 텍스트 */}
            <div className="mt-8 font-semibold text-base">
              {book.book_name}
            </div>
            <div className="text-sm mt-8 text-black">{book.authors}</div>
          </div>
        ))}
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
