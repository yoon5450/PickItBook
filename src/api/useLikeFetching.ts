import { useMutation } from "@tanstack/react-query";
import { likeRepo } from "./likes.repo.supabase";

export const useToggleLike = () => {
  // TODO: 낙관적 업데이트 적용하기 ( 왤캐 어렵냐 이거? )
  return useMutation({
    mutationKey: ["toggle-likes"],
    mutationFn: (vars: { review_id: number }) => likeRepo.toggleLike(vars),
    retry: 0,
  });
};
