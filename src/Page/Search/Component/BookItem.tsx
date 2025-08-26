import { AiFillStar } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";
import type { BookItemType } from "@/@types/global";

type Props = {
  item: BookItemType;
};

function BookItem({ item }: Props) {
  return (
    <>
      <li className="flex justify-between items-center px-2 py-6 border-b border-gray-50">
        {/* 책 이미지 */}
        <div className="flex gap-7">
          <div className="min-w-30">
            <img src={item.bookImageURL} alt="책 이미지" className="h-35" />
          </div>

          {/* 책 정보 */}
          <div className="flex flex-col gap-0.75 w-70">
            <h3 className="font-semibold text-primary-black  line-clamp-2 cursor-pointer">
              <a href={`/book_detail/${item.isbn13}`}>{item.bookname}</a>
            </h3>
            <p className="text-gray-500">
              <a className="hover:underline hover:decoration-gray-500 cursor-pointer">
                {item.authors}
              </a>
            </p>
            <p className="text-gray-500">
              {item.publisher} {item.publication_year}
            </p>
            <p>{item.class_nm}</p>
            <div className="flex gap-6">
              <button
                type="button"
                className="flex items-center justify-center gap-1 cursor-pointer rounded-full hover:bg-gray-10 transition-[.2]"
              >
                4.3 <AiFillStar className={"text-primary"} />
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-1 cursor-pointer rounded-full hover:bg-gray-10 transition-[.2]"
              >
                즐겨찾기 <BiBookmark />
              </button>
            </div>
          </div>
        </div>

        {/* 책 설명 */}
        <p className="w-1/3 line-clamp-5">책 설명이긴 한데....</p>

        {/* 아이템 버튼  */}
        <button
          type="button"
          className=" px-4 box-border h-11 bg-primary rounded-[10px] cursor-pointer"
        >
          내 서재에 추가
        </button>
      </li>
    </>
  );
}
export default BookItem;
