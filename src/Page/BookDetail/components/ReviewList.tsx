import type { ReviewItemType } from "@/@types/global";
import ReviewItem from "./ReviewItem";
import { useAuthStore } from "@/store/useAuthStore";

interface Props {
  data?: ReviewItemType[];
}

function ReviewList({ data }: Props) {
  const is_anonymous = useAuthStore((s) => s.user?.is_anonymous)

  return (
    <ul className="flex flex-col w-full gap-2 px-6 py-4">
      {data && data.map((item) => <ReviewItem item={item} key={item.id} isAnonymous={is_anonymous}/>)}
    </ul>
  );
}
export default ReviewList;
