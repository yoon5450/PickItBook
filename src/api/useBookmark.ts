import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bookmarkRepo } from "./bookmark.repo.supabase";

export const useBookmarkWithMissions = (isbn13: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!isbn13) throw new Error("isbn13 is required");
      return bookmarkRepo.bookmarkWithMissions(isbn13);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmarkWithMission", isbn13] });
    },
  });
};

export const useToggleBookmark = (isbn13: string | undefined) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!isbn13) throw new Error("isbn13 is required");
      return bookmarkRepo.toggleBookmark(isbn13);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookmark", isbn13] });
    },
  });
};
