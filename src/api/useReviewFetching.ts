import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewRepo } from "./review.repo.supabase";
import type { ReviewItemType } from "@/@types/global";

export type SetReviewType = {
  isbn13: string;
  title: string;
  content: string;
  score: number;
  uid: string;
  image_file?: File;
};

export const useSetReviewWithFiles = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["review", "create"],
    mutationFn: (vars: SetReviewType) => reviewRepo.setReviewWithFile(vars),
    retry: 0,
    onSuccess: (_newReview, vars) => {
      qc.invalidateQueries({ queryKey: ["review", "byIsbn", vars.isbn13] });
      qc.invalidateQueries({ queryKey: ["review", "byUser", vars.uid] });
    },
  });
};


export const useGetReview = (isbn13: string, p_limit = 20, p_offset = 0) => {
  return useQuery<ReviewItemType[], Error>({
    queryKey: ["review", "byIsbn", isbn13, p_limit, p_offset],
    queryFn: () => reviewRepo.getReview(isbn13, p_limit, p_offset),
    refetchOnWindowFocus:false,
    staleTime: 60_000,
  });
};
