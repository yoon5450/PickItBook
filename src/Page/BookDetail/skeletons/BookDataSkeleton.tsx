
function BookDataSkeleton() {
  return (
    <div className="relative flex gap-8 p-5 w-screen">
      {/* 미션 수령하기 버튼 */}
      <button
        type="button"
        className="px-4 py-2 w-30 h-12 rounded-md text-xl bg-gray-600 text-background-white absolute right-0 bottom-0"
        disabled={true}
      ></button>

      <div className="h-70 w-40 bg-gray-600" />
      <div className="w-[80%] flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          {/* 제목 */}
          <div className="w-1/2 h-7 bg-gray-600" />
          {/* 지은이, 출판사 */}
          <div className="w-1/4 h-6 bg-gray-600" />
        </div>
        <div className="w-40 h-10 bg-gray-600" />
        <div className="w-full h-20 bg-gray-600" />
        <div className="w-30 h-7 bg-gray-600"></div>

        <p className="flex gap-2 items-center">
          <div className="w-8" /> <div className="w-4" />{" "}
          <div className="w-4" /> <div className="w-4" />
        </p>
        <p>
          <button
            type="button"
            className="flex items-center gap-2"
            disabled={true}
          >
            <div className="w-8" />
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
  );
}
export default BookDataSkeleton;
