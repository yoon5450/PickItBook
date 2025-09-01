import type { ReviewItemType } from "@/@types/global";
import { useToggleLike } from "@/api/useLikeFetching";
import RatingStars from "@/Components/RatingStar";

interface Props {
  item: ReviewItemType;
}

function ReviewItem({ item }: Props) {
  const {mutate, isPending} = useToggleLike(item.id)

  return (
    <li className="flex flex-col p-4 bg-white rounded-md gap-2">
      {/* 헤더 영역 */}
      <header className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <img className="h-8 rounded-full" src={item.profile_image} alt="" />
          <span>{item.nickname}</span>
        </div>
        <div className="flex gap-4">
          <span>{item.create_at}</span>
          <button type="button" className="cursor-pointer">
            삭제
          </button>
          <button type="button" className="cursor-pointer">
            편집
          </button>
        </div>
      </header>

      {/* 컨텐츠 영역 */}
      <section className="flex">
        {item.image_url && (
          <img
            src={item.image_url}
            alt="리뷰 이미지"
            className="max-w-40 object-cover"
          />
        )}
        <div>
          <p className="font-bold">{item.title}</p>
          <p>{item.content}</p>
        </div>
      </section>

      {/* 푸터 영역 */}
      <footer className="flex justify-between items-center">
        <RatingStars value={item.score} showValue />
        <div className="flex gap-4">
          <button
            type="button"
            disabled={isPending}
            onClick={() => mutate()}
          >
            <span className={item.liked_by_me ? "text-amber-400" : "bg-white"}>유용해요 {item.like_count}</span>
          </button>
          <button type="button">댓글</button>
        </div>
      </footer>
    </li>
  );
}
export default ReviewItem;
