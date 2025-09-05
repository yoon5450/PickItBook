import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkRepo } from "./bookmark.repo.supabase";
import { logicRpcRepo } from "./logicRpc.repo.supabase";

// 북마크하면서 해당 책에 대한 모든 미션을 받아옵니다.
export const useBookmarkWithMissions = (isbn13: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!isbn13) throw new Error("isbn13 is required");
      // 북마크 API 호출
      const { error } = await bookmarkRepo.toggleBookmark(isbn13);

      // 번들 미션 API 호출
      logicRpcRepo.setBundle(isbn13);

      // 이벤트 객체 호출
      logicRpcRepo.setProcessEvent("BOOKMARK_ADDED", { bookmark_id: isbn13 });

      if (error) console.error("useBookmarkWithMissions", error);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["bookmarkWithMission", isbn13],
      });
    },
  });
};

// 북마크 토글을 처리합니다.
export const useToggleBookmark = (isbn13: string | undefined, uid?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!isbn13) throw new Error("isbn13 is required");
      return bookmarkRepo.toggleBookmark(isbn13);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark", isbn13] });
      if (uid) queryClient.invalidateQueries({ queryKey: ["bookmarks", uid] });
    },
  });
};
