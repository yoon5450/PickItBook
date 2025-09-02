import type { BookDetailData } from "@/api/useBookDetail";
import loaderIcon from "@/assets/loading.svg";
import RatingStars from "@/Components/RatingStar";
import { NavLink } from "react-router-dom";
import { BiBookmark } from "react-icons/bi";
import { useBookmarkWithMissions } from "@/api/useBookmark";
import { getBookImageURLs } from "@/utils/bookImageUtils";

interface Props {
  data: BookDetailData | undefined;
  isBookMarked: boolean | undefined;
  ratingAvg: number
  reviewSize?: number
}

function BookDataPatition({ data, ratingAvg, reviewSize }: Props) {
  const isbn13 = data?.book?.isbn13;
  const { mutate } = useBookmarkWithMissions(isbn13);

  if (!data) {
    return (
      <img
        className="h-25 text-center p-1 inline object-cover"
        src={loaderIcon}
        alt="로딩중"
      />
    );
  }

  const { book } = data;
  if (!book) {
    return <div className="py-8">도서 정보를 찾을 수 없습니다.</div>;
  }


  return (
    <>
      {/* 도서 정보 */}
      <div className="relative flex gap-8 p-5">
        {/* 북마크 버튼 */}
        <button type="button" className="absolute right-0 top-0">
          <BiBookmark size={32} />
        </button>

        {/* 미션 수령하기 버튼 */}
        <button
          type="button"
          className="px-4 py-2 rounded-md text-xl bg-primary text-background-white absolute right-0 bottom-0"
          onClick={() => mutate(book.isbn13)}
        >
          미션 수령하기
        </button>

        <img src={getBookImageURLs(book.isbn13)[0] ?? undefined} alt="" className="h-70" />
        <div className="flex flex-col gap-1">
          <h1 className="text-black">{book.bookname}</h1>
          <div className="flex gap-2 text-[#606060]">
            {book.authors.split(";").map((item) => (
              <span key={item}>{item}</span>
            ))}
            <span>{book.publisher}</span>
            <span>{book.publication_year}</span>
          </div>
          <div className="flex items-center gap-2">
            <RatingStars value={ratingAvg} max={5} size={32} showValue />
            <span className="text-[#606060]">{reviewSize || "0"} 리뷰</span>
          </div>
          <div className="py-3">
            <span className="line-clamp-5 text-black">{book.description}</span>
            <div>
              <button type="button" className="flex items-center gap-2">
                더보기
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="17"
                  height="9"
                  viewBox="0 0 17 9"
                  fill="none"
                >
                  <path
                    d="M1 1L8.5 8L16 1"
                    stroke="black"
                    strokeOpacity="0.57"
                  />
                </svg>
              </button>
            </div>
          </div>

          <p className="flex gap-2 items-center">
            <span>장르 구분</span>

            {book.class_nm.split(" > ").map((item) => (
              <NavLink to={"#"} className={"hover:underline"} key={item}>
                {item}
              </NavLink>
            ))}
          </p>
          <p>
            <button type="button" className="flex items-center gap-2">
              책 정보
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="17"
                height="9"
                viewBox="0 0 17 9"
                fill="none"
              >
                <path d="M1 1L8.5 8L16 1" stroke="black" strokeOpacity="0.57" />
              </svg>
            </button>
          </p>
        </div>
      </div>
    </>
  );
}
export default BookDataPatition;
