import { useMutation, useQuery, type UseMutationOptions } from "@tanstack/react-query";
import { reviewReplysRepo } from "./reviewReplys.repo.supabase";
import type { FetchingOptions } from "@/@types/global";
import type { Tables } from "@/@types/database.types";

export type ReplyType = Tables<"v_review_replys_with_author">;

// Define types for clarity
type ReplyVariables = { content: string; parent_id: number };

export const useSetReply = (
  options?: UseMutationOptions<unknown, Error, ReplyVariables>
) => {
  return useMutation({
    mutationKey: ["setReply"],
    mutationFn: ({ content, parent_id }: ReplyVariables) =>
      reviewReplysRepo.setReply(content, parent_id),
    retry: 0,
    ...options,
  });
};

export const useGetReplyByParentId = (
  parent_id: number,
  opts: FetchingOptions = {}
) => {
  const {
    enabled = true,
    staleTime = 60_000,
    gcTime = 5 * 60_000,
    refetchOnWindowFocus = false,
  } = opts;

  return useQuery<ReplyType[], Error>({
    queryKey: ["getReplysByParentId", parent_id],
    queryFn: () => reviewReplysRepo.getReplyByParentId(parent_id),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus,
  });
};
