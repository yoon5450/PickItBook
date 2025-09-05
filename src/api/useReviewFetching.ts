import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewRepo } from "./review.repo.supabase";
import type { FetchingOptions, ReviewItemType } from "@/@types/global";
import { logicRpcRepo } from "./logicRpc.repo.supabase";
import type { Tables } from "@/@types/database.types";

export type SetReviewType = {
  isbn13: string;
  title: string;
  content: string;
  score: number;
  uid: string;
  image_file?: File;
};

export type UpdateReviewVars = {
  id: number;
  content?: string;
  score?: number;
  new_image_file?: File;
};

// 파일과 함께 리뷰를 게시합니다 ( 파일 없어도 상관 없음 )
export const useSetReviewWithFiles = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["review", "create"],
    mutationFn: (vars: SetReviewType) => reviewRepo.setReviewWithFile(vars),
    retry: 0,
    onSuccess: (_newReview, vars) => {
      logicRpcRepo.setProcessEvent("REVIEW_CREATED", {
        book_id: vars.isbn13,
        review_id: _newReview.id,
      });
      qc.invalidateQueries({ queryKey: ["review", "byIsbn", vars.isbn13] });
      qc.invalidateQueries({ queryKey: ["review", "byUser", vars.uid] });
    },
  });
};

// isbn에 기반한 리뷰 데이터를 가져옵니다.
export const useGetReview = (isbn13: string, p_limit = 50, p_offset = 0) => {
  return useQuery<ReviewItemType[], Error>({
    queryKey: ["review", "byIsbn", isbn13, p_limit, p_offset],
    queryFn: () => reviewRepo.getReview(isbn13, p_limit, p_offset),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
};

// 내 리뷰 목록을 가져옵니다.
export const useGetMyReviews = (uid: string, limit = 20, offset = 0) =>
  useQuery<ReviewItemType[], Error>({
    queryKey: ["review", "byUser", uid, limit, offset],
    queryFn: () => reviewRepo.getReviewByUser(uid, limit, offset),
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });

// 리뷰 기존 내용을 업데이트합니다. 
export const useUpdateReview = (opts?: { invalidate?: { byUser?: string; byIsbn?: string } }) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["review", "update"],
    mutationFn: (vars: UpdateReviewVars) => reviewRepo.updateReview(vars),
    onSuccess: () => {
      if (opts?.invalidate?.byUser) {
        qc.invalidateQueries({ queryKey: ["review", "byUser", opts.invalidate.byUser] });
        qc.invalidateQueries({ queryKey: ["myReviewsWithCount", opts.invalidate.byUser] }); 
      }
      if (opts?.invalidate?.byIsbn) {
        qc.invalidateQueries({
          queryKey: ["review", "byIsbn", opts.invalidate.byIsbn],
        });
      }
    },
  });
};

// 리뷰를 삭제합니다.
export const useDeleteReview = (opts?: { invalidate?: { byUser?: string; byIsbn?: string } }) => {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["review", "delete"],
    mutationFn: (id: number) => reviewRepo.deleteReview(id),
    onSuccess: () => {
      if (opts?.invalidate?.byUser) {
        qc.invalidateQueries({ queryKey: ["review", "byUser", opts.invalidate.byUser] });
        qc.invalidateQueries({ queryKey: ["myReviewsWithCount", opts.invalidate.byUser] }); 
      }
      if (opts?.invalidate?.byIsbn) {
        qc.invalidateQueries({
          queryKey: ["review", "byIsbn", opts.invalidate.byIsbn],
        });
      }
    },
  });
};

type ReviewsScoreType = Tables<"v_review_stats">

// isbn 목록에 기반한 리뷰 점수 목록을 가져옵니다.
export const useGetReviewsScore = (isbns: string[], opts:FetchingOptions = {}) => {
  const {
    enabled = !!isbns,
    staleTime = 60_000,
    gcTime = 5 * 60_000,
    refetchOnWindowFocus = false,
  } = opts;

  return useQuery<ReviewsScoreType[], Error>({
    queryKey:['reviewsScore', isbns],
    queryFn:() => reviewRepo.getReviewsScore(isbns),
    enabled,
    staleTime,
    gcTime,
    refetchOnWindowFocus
  });
};
