import type { ReviewItemType } from "@/@types/global";
import ReviewList from "./ReviewList";

interface Props {
  data?: ReviewItemType[] ;
  isbn13: string;
}


function ReviewListPartition({ data, isbn13 }: Props) {

  // TODO : 길어진다면 전체보기 버튼으로 펼치던가 해야할 듯?
  return (
    <div>
      <ReviewList data={data} isbn13={isbn13}/>
    </div>
  );
}
export default ReviewListPartition;
