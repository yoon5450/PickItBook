import type { ReviewItemType } from "@/@types/global";
import ReviewItem from "./ReviewItem";
import { useToggleLike } from "@/api/useLikeFetching";

interface Props {
  data?: ReviewItemType[];
}

function ReviewList({ data }: Props) {
  const {mutate} = useToggleLike();
  console.log(data);

  return (
    <ul className="flex flex-col w-full gap-2 px-6 py-4">
      {data && data.map((item) => <ReviewItem item={item} key={item.id} handleLikeToggle={mutate}/>)}
    </ul>
  );
}
export default ReviewList;
