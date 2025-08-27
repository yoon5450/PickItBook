import { AiFillStar } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";
import type { BookItemType, SearchKey } from "@/@types/global";
import type { listMode } from "..";
import tw from "@/utils/tw";
import { NavLink } from "react-router-dom";

type Props = {
  item: BookItemType;
  onSearch: ({ key, value }: { key: SearchKey; value: string }) => void;
  mode: listMode;
};

const modeLiClass = {
  line: "flex justify-between items-center px-2 py-6 border-b border-gray-200",
  grid: "flex flex-col gap-2 w-fit items-center justify-center",
} as const;

const modeImgClass = {
  line: "",
  grid: "h-50",
} as const;

function BookItem({ item, onSearch, mode = "line" }: Props) {
  return (
    <>
      <li className={modeLiClass[mode]}>
        {/* 책 이미지 */}

        <NavLink to={`/book_detail/${item.isbn13}`}>
          <img
            src={item.bookImageURL}
            alt="책 이미지"
            className={tw("h-35", modeImgClass[mode])}
          />
        </NavLink>

        {/* 책 정보  (모드에 따라 전환)*/}
        {mode === "line" && (
          <div className="flex flex-col gap-0.75 w-70">
            <h3 className="font-semibold text-primary-black  line-clamp-2 cursor-pointer">
              <NavLink to={`/book_detail/${item.isbn13}`}>
                {item.bookname}
              </NavLink>
            </h3>
            <p className="text-gray-500">
              {/* TODO: 링크 검색 개선 */}
              {item.authors.split(";").map((author) => (
                <a
                  className="hover:underline hover:decoration-gray-500 cursor-pointer"
                  onClick={() =>
                    onSearch({ key: "author", value: author.split(":")[1] })
                  }
                >
                  {author}
                </a>
              ))}
            </p>
            <p className="text-gray-500 flex gap-2 items-center">
              <a
                className="hover:underline hover:decoration-gray-500 cursor-pointer"
                onClick={() =>
                  onSearch({ key: "keyword", value: item.publisher })
                }
              >
                {item.publisher}
              </a>
              {item.publication_year}
            </p>
            <p>{item.class_nm}</p>
            <div className="flex gap-6">
              <button
                type="button"
                className="flex items-center justify-center gap-1 cursor-pointer rounded-full hover:bg-gray-200 transition-[.2]"
              >
                4.3 <AiFillStar className={"text-primary"} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1 cursor-pointer rounded-full hover:bg-gray-200 transition-[.2]"
              >
                즐겨찾기
                <BiBookmark />
              </button>
            </div>
          </div>
        )}

        {/* 책 정보 */}
        {mode === "grid" && (
          <div className="w-full">
            <h3 className="font-semibold text-primary-black  line-clamp-2 cursor-pointer">
              <NavLink to={`/book_detail/${item.isbn13}`}>
                {item.bookname}
              </NavLink>
            </h3>
            <div className="flex justify-between">
              <div>
                {item.authors.split(";").map((item) => (
                  <span>{item}</span>
                ))}
              </div>
              <button
                type="button"
                className="flex items-center justify-center gap-1 cursor-pointer rounded-full hover:bg-gray-200 transition-[.2]"
              >
                4.3 <AiFillStar className={"text-primary"} />
              </button>
            </div>
          </div>
        )}

        {mode === "line" && (
          <>
            {/* 책 설명 */}
            <p className="w-1/3 line-clamp-5">책 설명이긴 한데....</p>

            {/* 아이템 버튼  */}
            <button
              type="button"
              className=" px-4 box-border h-11 bg-primary rounded-[10px] cursor-pointer"
            >
              내 서재에 추가
            </button>
          </>
        )}
      </li>
    </>
  );
}
export default BookItem;
