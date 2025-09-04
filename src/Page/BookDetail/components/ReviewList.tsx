import type { ReviewItemType } from "@/@types/global";
import ReviewItem from "./ReviewItem";
import { useAuthStore } from "@/store/useAuthStore";
import { useSetReply } from "@/api/useReviewReplyFetching";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  data?: ReviewItemType[];
}

function ReviewList({ data }: Props) {
  const is_anonymous = useAuthStore((s) => s.user?.is_anonymous);
  const uid = useAuthStore((s) => s.user?.id);
  const queryClient = useQueryClient();

  const { mutate: setReply } = useSetReply({
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["getReplysByParentId", variables.parent_id],
      });
    },
  });

  return (
    <ul className="flex flex-col w-full gap-2 px-6 py-4">
      {data &&
        data.map((item) => (
          <ReviewItem
            item={item}
            key={item.id}
            isAnonymous={is_anonymous}
            uid={uid}
            setReplyCallback={setReply}
          />
        ))}
    </ul>
  );
}
export default ReviewList;
