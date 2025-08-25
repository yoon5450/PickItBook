import { AiFillStar } from "react-icons/ai";
import { BiBookmark } from "react-icons/bi";

function BookItem() {
  return (
    <>
      <div className="flex justify-between items-center px-2 py-6">
        <div className="flex gap-7">
          <img
            src="https://bookthumb-phinf.pstatic.net/cover/060/596/06059601.jpg?type=m1&udate=20110930"
            alt="책 이미지"
            className="h-35"
          />

          <div className="flex flex-col gap-0.75">
            <h3 className="font-semibold text-primary-black max-w-70 line-clamp-2 cursor-pointer">
              용의자 X의 헌신
            </h3>
            <p className="text-gray-500">
              <a className="hover:underline hover:decoration-gray-500 cursor-pointer">
                히가시노 게이고
              </a>
            </p>
            <p className="text-gray-500">현대문학 2009</p>
            <p>추리</p>
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

        <p className="w-1/3 line-clamp-5">책 설명이긴 한데....</p>

        <button
          type="button"
          className=" px-4 box-border h-11 bg-primary rounded-[10px] cursor-pointer"
        >
          내 서재에 추가
        </button>
      </div>
      <hr className="text-background-gray" />
    </>
  );
}
export default BookItem;
