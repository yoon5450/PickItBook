import type { ReviewItemType } from "@/@types/global";
import ReviewItem from "./ReviewItem";
import { useAuthStore } from "@/store/useAuthStore";
import { useSetReply } from "@/api/useReviewReplyFetching";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteReview } from "@/api/useReviewFetching";

interface Props {
  data?: ReviewItemType[];
  isbn13: string;
}

function ReviewList({ data, isbn13 }: Props) {
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

  const { mutate: deleteReview } = useDeleteReview({
    invalidate: { byIsbn: isbn13 },
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
            deleteReviewCallback={deleteReview}
          />
        ))}
    </ul>
  );
}
export default ReviewList;
