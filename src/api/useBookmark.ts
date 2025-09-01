import supabase from "@/utils/supabase";
import { useMutation } from "@tanstack/react-query";
import { logicRpcRepo } from "./logicRPC.repo.supabase";

export const useBookmark = (isbn13: string) => {
  return useMutation({
    mutationKey: ["bookmark", isbn13],
    mutationFn: async (isbn13: string) => {
      // 실제 북마크 API 호출
      logicRpcRepo.setBundle(isbn13);
      const { error } = await supabase
        .from("bookmark")
        .insert({ book_id: isbn13 })
        .single();
        
      if (error) console.error("Add Bookmark", error);
    },
  });
};
