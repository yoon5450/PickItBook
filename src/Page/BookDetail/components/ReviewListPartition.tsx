import type { ReviewItem } from "@/@types/global";
import ReviewList from "./ReviewList";

interface Props {
  data: ReviewItem[];
}

function ReviewListPartition({ data }: Props) {
  return (
    <div>
      <ReviewList data={data} />
    </div>
  );
}
export default ReviewListPartition;
