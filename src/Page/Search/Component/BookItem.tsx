import { AiFillStar } from "react-icons/ai";
import type { SearchKey } from "@/@types/global";
import type { listMode, MergedType } from "..";
import tw from "@/utils/tw";
import { NavLink } from "react-router-dom";
import { getBookImageURLs } from "@/utils/bookImageUtils";
import type {} from "@/@types/database.types";
import RatingStars from "@/Components/RatingStar";

type Props = {
  item: MergedType;
  onSearch: ({ key, value }: { key: SearchKey; value: string }) => void;
  mode: listMode;
};

const modeLiClass = {
  line: "flex justify-between items-center px-2 py-6 border-b border-gray-200",
  grid: "flex flex-col gap-2 mt-4 w-fit items-center justify-center",
} as const;

const modeImgClass = {
  line: "relative w-full aspect-[2/3] overflow-hidden rounded-md bg-gray-50 ",
  grid: "relative h-60 aspect-[2/3] overflow-hidden rounded-md bg-gray-50 flex-shrink-0",
} as const;

function BookItem({ item, onSearch, mode = "line" }: Props) {
  const responsiveLineClass =
    mode === "line"
      ? "flex-col items-center sm:flex-row sm:justify-between sm:items-center gap-4"
      : "";

  return (
    <>
      <li className={tw(modeLiClass[mode], responsiveLineClass)}>
        {/* 책 이미지 & 정보 (공통) */}
        <div className="flex flex-col gap-5 items-center sm:flex-row sm:items-center ">
          <NavLink
            className={"flex-shrink-0 sm:w-32"}
            to={`/book_detail/?isbn13=${item.isbn13}`}
          >
            <img
              src={getBookImageURLs(item.isbn13)[0] ?? undefined}
              alt="책 이미지"
              className={tw(modeImgClass[mode])}
            />
          </NavLink>

          {/* 책 정보 (line 모드) */}
          {mode === "line" && (
            <div className="flex flex-col justify-between h-48">
              <div className="flex flex-col gap-0.75 w-94">
                <h3 className="font-semibold text-primary-black line-clamp-2 cursor-pointer text-2xl">
                  <NavLink to={`/book_detail/?isbn13=${item.isbn13}`}>
                    {item.bookname}
                  </NavLink>
                </h3>
                <p className="text-gray-500 text-[20px]">
                  {item.authors.split(";").map((author, index) => (
                    <a
                      key={index}
                      className="hover:underline hover:decoration-gray-500 cursor-pointer"
                      onClick={() =>
                        onSearch({ key: "author", value: author.split(":")[1] })
                      }
                    >
                      {author}
                    </a>
                  ))}
                </p>
                <p className="text-gray-500 flex gap-2 items-center text-[20px]">
                  <a
                    className="hover:underline hover:decoration-gray-500 cursor-pointer text-[20px]"
                    onClick={() =>
                      onSearch({ key: "keyword", value: item.publisher })
                    }
                  >
                    {item.publisher}
                  </a>
                  {item.publication_year}
                </p>
              </div>
              <p>{item.class_nm.split(">").join("|")}</p>
            </div>
          )}
        </div>

        {/* 책 정보 (grid 모드) */}
        {mode === "grid" && (
          <div className="w-full">
            <h3 className="font-semibold text-primary-black line-clamp-2 cursor-pointer">
              <NavLink to={`/book_detail/?isbn13=${item.isbn13}`}>
                {item.bookname}
              </NavLink>
            </h3>
            <div className="flex justify-between">
              <div>
                {item.authors.split(";").map((author, index) => (
                  <span key={index}>{author}</span>
                ))}
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-1 cursor-pointer rounded-full hover:bg-gray-200 transition-[.2]"
              >
                {item.avg_score ?? "0.0"}
                <AiFillStar className={"text-primary"} />
              </button>
            </div>
          </div>
        )}

        {/* 평점 & 버튼 (line 모드) */}
        {mode === "line" && (
          <>
            <RatingStars value={item.avg_score ?? 0} showValue size={30} />
            <NavLink
              to={`/book_detail/?isbn13=${item.isbn13}`}
              className="flex justify-center items-center px-4 box-border h-11 bg-primary rounded-[10px] cursor-pointer text-white"
            >
              상세 페이지
            </NavLink>
          </>
        )}
      </li>
    </>
  );
}
export default BookItem;
