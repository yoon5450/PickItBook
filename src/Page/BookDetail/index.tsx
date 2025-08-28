import { useBookDetail } from "@/api/useBookDetail";
import { useSearchParams } from "react-router-dom";
import BookData from "./component/bookData";
import Recommanded from "./component/Recommanded";
import PartitionBase from "./component/partitionBase";
import RatingStars from "@/Components/RatingStar";
import UserScore from "./component/UserScore";

function BookDetail() {
  const [searchParams, setSearchParams] = useSearchParams();
  const isbn13 = searchParams.get("isbn13") ?? "";

  const {
    data: BookDetailData,
    isFetching: BookDetailFetching,
    error,
  } = useBookDetail(isbn13);

  if (error) console.error(error);

  return (
    <div className="flex justify-center w-full bg-pattern">
      <div className="flex flex-col items-center min-h-screen w-[1200px] px-8 bg-background-white pt-15">
        {/* 로딩중 아이콘 */}

        <PartitionBase title="도서 정보">
          <BookData data={BookDetailData} isFetching={BookDetailFetching} />
        </PartitionBase>

        <PartitionBase
          title="추천"
          subtitle="이 책을 읽은 사람들이 많이 선택한 책"
        >
          <Recommanded
            data={Array(4).fill(BookDetailData)}
            isFetching={BookDetailFetching}
          />
        </PartitionBase>

        <PartitionBase title="관련 미션">

        </PartitionBase>

        <PartitionBase title="유저 평점">
          <UserScore/>
        </PartitionBase>

        <PartitionBase
        title="리뷰">
          
        </PartitionBase>
      </div>
    </div>
  );
}
export default BookDetail;
