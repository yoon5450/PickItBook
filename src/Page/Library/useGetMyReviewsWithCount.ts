import { useQuery } from "@tanstack/react-query";
import { getMyReviews } from "@/api/getMyReview";
import type { Tables } from "@/@types/supabase";

type ReviewRow = Tables<"review">;

type MyReviewsResponse = {
  data: ReviewRow[];
  count: number;
};

export function useGetMyReviewsWithCount(
  userId: string,
  limit: number,
  offset: number
) {
  return useQuery({
    queryKey: ["myReviewsWithCount", userId, limit, offset],
    queryFn: (): Promise<MyReviewsResponse> =>
      getMyReviews(userId, limit, offset),
    placeholderData: (prev) => prev, 
  });
}
