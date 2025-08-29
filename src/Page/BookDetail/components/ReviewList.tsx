import type { ReviewItem } from "@/@types/global";
import RatingStars from "@/Components/RatingStar";



interface Props {
  data: ReviewItem[];
}

function ReviewList({ data }: Props) {
  return (
    <ul className="flex flex-col w-full gap-2 px-6 py-4">
      {data.map(({ id, create_at, user_id, title, content, score }) => (
        <li className="flex flex-col p-4 bg-white rounded-md gap-2" key={id}>
          {/* 헤더 영역 */}
          <header className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <img className="h-8 rounded-full" src="/profile_default.png" alt="" />
              <span>{user_id}</span>
            </div>
            <div className="flex gap-4">
              <span>{create_at}</span>
              <button type="button" className="cursor-pointer">
                삭제
              </button>
              <button type="button" className="cursor-pointer">
                편집
              </button>
            </div>
          </header>

          {/* 컨텐츠 영역 */}
          <section>
            <p>{title}</p>
            <p>{content}</p>
          </section>

          {/* 푸터 영역 */}
          <footer className="flex justify-between items-center">
            <RatingStars value={score} showValue/>
            <div className="flex gap-4">
              <button type="button">유용해요</button>
              <button type="button">댓글</button>
            </div>
          </footer>
        </li>
      ))}
    </ul>
  );
}
export default ReviewList;
