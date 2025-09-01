import type { ReviewItemType } from "@/@types/global";
import ReviewItem from "./ReviewItem";

interface Props {
  data?: ReviewItemType[];
}

function ReviewList({ data }: Props) {

  return (
    <ul className="flex flex-col w-full gap-2 px-6 py-4">
      {data && data.map((item) => <ReviewItem item={item} key={item.id}/>)}
    </ul>
  );
}
export default ReviewList;
