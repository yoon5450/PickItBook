import { useBookDetail } from "@/api/useBookDetail";
import { useSearchParams } from "react-router-dom";
import BookDataPartition from "./components/BookDataPartition";
import RecommandedPatition from "./components/RecommendedPatition";
import PartitionBase from "./components/PartitionBase";
import UserScorePatition from "./components/UserScorePartition";
import MisstionPartition from "./components/MissionPartition";
import ReviewWritePartition from "./components/ReviewWritePartition";
import ReviewListPartition from "./components/ReviewListPartition";
import { useEffect } from "react";
import { scrollTop } from "@/utils/scrollFunctions";
import { useGetReview } from "@/api/useReviewFetching";
import { useGetMissionByISBN } from "@/api/useMissionsFetching";

function BookDetail() {
  const [searchParams] = useSearchParams();
  const isbn13 = searchParams.get("isbn13") ?? "";

  // init
  useEffect(() => {
    scrollTop();
  }, []);

  // BookDetail 정보 불러오기
  const {
    data: BookDetailData,
    isFetching: BookDetailFetching,
    error,
  } = useBookDetail(isbn13);

  // Review 정보 불러오기
  const {data:reviewData} = useGetReview(isbn13)

  // Mission 정보 불러오기
  const {data:missionData} = useGetMissionByISBN(isbn13);

  console.log(missionData);

  if (error) console.error(error);

  return (
    <div className="flex justify-center w-full bg-pattern">
      <div className="flex flex-col items-center min-h-screen w-[1200px] px-8 bg-background-white pt-15">
        {/* 로딩중 아이콘 */}

        <PartitionBase title="도서 정보">
          <BookDataPartition
            data={BookDetailData}
            isFetching={BookDetailFetching}
            isBookMarked={missionData?.[0].assigned}
          />
        </PartitionBase>

        <PartitionBase
          title="추천"
          subtitle="이 책을 읽은 사람들이 많이 선택한 책"
        >
          <RecommandedPatition
            data={Array(4).fill(BookDetailData)}
            isFetching={BookDetailFetching}
          />
        </PartitionBase>

        <PartitionBase title="관련 미션">
          <MisstionPartition data={missionData} />
        </PartitionBase>

        <PartitionBase title="유저 평점">
          <UserScorePatition data={reviewData}/>
        </PartitionBase>

        <PartitionBase title="리뷰 작성">
          <ReviewWritePartition data={BookDetailData}/>
        </PartitionBase>

        <PartitionBase title={`리뷰 목록 (${reviewData?.length})`} className="min-h-80 mb-10">
          <ReviewListPartition data={reviewData} />
        </PartitionBase>
      </div>
    </div>
  );
}
export default BookDetail;
