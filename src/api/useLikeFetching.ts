import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeRepo } from "./likes.repo.supabase";
import type { ReviewItemType } from "@/@types/global";

// 낙관적 업데이트용 토글 유틸
// TODO : 반드시 리팩터링!
function toggleLikeInCache<T>(oldData: T, review_id: number): T {
  if (!oldData) return oldData;

  const toggleItem = <R extends ReviewItemType>(it: R): R => {
    if (it.id !== review_id) return it;
    const nextLiked = !it.liked_by_me;
    const nextCount = Math.max(0, (it.like_count ?? 0) + (nextLiked ? 1 : -1));
    return { ...it, liked_by_me: nextLiked, like_count: nextCount } as R;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (Array.isArray(oldData))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return oldData.map((it: any) => toggleItem(it)) as unknown as T;

  if (typeof oldData === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = oldData;

    if (Array.isArray(obj.pages)) {
      return {
        ...obj,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pages: obj.pages.map((p: any) => toggleLikeInCache(p, review_id)),
      } as T;
    }

    for (const key of ["data", "items", "rows", "list"]) {
      if (Array.isArray(obj[key])) {
        return {
          ...obj,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          [key]: obj[key].map((it: any) => toggleItem(it)),
        } as T;
      }
    }

    if ("id" in obj)
      return (obj.id === review_id ? toggleItem(obj) : oldData) as T;
  }

  return oldData;
}

// 서버 값으로 확정 패치
function patchLikeInCache<T>(
  oldData: T,
  reviewId: number,
  liked: boolean,
  likeCount: number
): T {
  if (!oldData) return oldData;

  const patchItem = <R extends ReviewItemType>(it: R): R =>
    it?.id === reviewId
      ? ({ ...it, liked_by_me: liked, like_count: likeCount } as R)
      : it;

  if (Array.isArray(oldData))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return oldData.map((it: any) => patchItem(it)) as unknown as T;

  if (typeof oldData === "object") {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const obj: any = oldData;
    if (Array.isArray(obj.pages)) {
      return {
        ...obj,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pages: obj.pages.map((p: any) =>
          patchLikeInCache(p, reviewId, liked, likeCount)
        ),
      } as T;
    }
    for (const key of ["data", "items", "rows", "list"]) {
      if (Array.isArray(obj[key])) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { ...obj, [key]: obj[key].map((it: any) => patchItem(it)) } as T;
      }
    }
    if ("id" in obj)
      return (obj.id === reviewId ? (patchItem(obj) as T) : oldData) as T;
  }
  return oldData;
}

// 좋아요 토글 처리합니다.
export const useToggleLike = (review_id: number) => {
  // TODO: 낙관적 업데이트 적용하기 ( 왤캐 어렵냐 이거? )
  const qc = useQueryClient();

  return useMutation({
    mutationKey: ["toggle-likes"],
    mutationFn: () => likeRepo.toggleLike({ review_id }),
    retry: 0,

    onMutate: async () => {
      await Promise.all([
        qc.cancelQueries({ queryKey: ["review"] }),
        qc.cancelQueries({ queryKey: ["review", review_id] }),
      ]);

      const prevList = qc.getQueriesData({ queryKey: ["reviews"] });
      const prevDetail = qc.getQueryData(["review", review_id]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qc.setQueriesData({ queryKey: ["review"] }, (old: any) =>
        toggleLikeInCache(old, review_id)
      );
      
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qc.setQueryData(["review", review_id], (old: any) =>
        toggleLikeInCache(old, review_id)
      );

      return { prevList, prevDetail };
    },

    onError: (_err, _vars, ctx) => {
      if (!ctx) return;
      for (const [key, data] of ctx.prevList ?? []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        qc.setQueryData(key as any, data);
      }
      qc.setQueryData(["review", review_id], ctx.prevDetail);
    },

    onSuccess: (res) => {
      qc.setQueriesData(
        { queryKey: ["review"] },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (old: any) =>
          patchLikeInCache(old, review_id, res.liked, res.like_count)
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      qc.setQueryData(["review", review_id], (old: any) =>
        patchLikeInCache(old, review_id, res.liked, res.like_count)
      );
    },
  });
};
