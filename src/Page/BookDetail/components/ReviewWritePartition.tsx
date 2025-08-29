import RatingStars from "@/Components/RatingStar";
import { useId } from "react";
import { BiImageAdd } from "react-icons/bi";

function ReviewWritePartition() {
  const reviewId = useId();

  return (
    <div className="p-4">
      <form className="flex flex-col items-end gap-2" action="">
        <div className="relative w-full">
          <label htmlFor={reviewId} className="a11y">
            리뷰 작성
          </label>
          <textarea
            className="border-gray-300 rounded-2xl w-full bg-background-white border resize-none focus:outline-0 p-6"
            rows={4}
            name={reviewId}
            id={reviewId}
            placeholder="리뷰를 작성해주세요"
          ></textarea>
          <BiImageAdd
            size={32}
            className="absolute right-5 bottom-5 text-gray-400 cursor-pointer hover:text-black transition"
          />
        </div>
        <div className="flex items-center gap-4">
          <RatingStars value={4} max={5} size={28} showValue inputMode/>
          <button
            className="bg-primary-black text-white hover:text-primary-black text-[20px] font-light
            box-border border border-primary-black px-4 py-2 rounded-md hover:bg-inherit transition "
            type="button"
          >
            리뷰 작성하기
          </button>
        </div>
      </form>
    </div>
  );
}
export default ReviewWritePartition;
