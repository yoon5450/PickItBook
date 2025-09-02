import supabase from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { logicRpcRepo } from "./logicRpc.repo.supabase";
import { bookmarkRepo } from "./bookmark.repo.supabase";

export const useBookmarkWithMissions = (isbn13: string | undefined) => {
  return useMutation({
    mutationKey: ["bookmark", isbn13],
    mutationFn: async (isbn13: string) => {
      // 북마크 API 호출
      const { error } = await supabase
        .from("bookmark")
        .insert({ isbn13: isbn13 });

      // 번들 미션 API 호출
      logicRpcRepo.setBundle(isbn13);

      // 이벤트 객체 호출
      logicRpcRepo.setProcessEvent("BOOKMARK_ADDED", { bookmark_id: isbn13 });

      if (error) console.error("Add Bookmark", error);
    },
    retry: 0,
  });
};

export const useToggleBookmark = (isbn13: string) => {
  return useMutation({
    mutationKey: ["toggleBookmark", isbn13],
    mutationFn: async () => {
      await bookmarkRepo.toggleBookmark(isbn13);
    },
    retry: 0,
  });
};
