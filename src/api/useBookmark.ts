import supabase from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { logicRpcRepo } from "./logicRPC.repo.supabase";

export const useBookmark = (isbn13: string | undefined) => {
  return useMutation({
    mutationKey: ["bookmark", isbn13],
    mutationFn: async (isbn13: string) => {
      // 실제 북마크 API 호출
      logicRpcRepo.setBundle(isbn13);
      const { error } = await supabase
        .from("bookmark")
        .insert({ isbn13: isbn13 })

      if (error) console.error("Add Bookmark", error);
    },
    retry: 0,
  });
};
