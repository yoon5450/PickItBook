import type { BookmarkItem } from "@/@types/global";
import { useAuthStore } from "@/store/useAuthStore";
import supabase from "@/utils/supabase";
import { useQuery } from "@tanstack/react-query";

// supabase에서 유저의 북마크 목록 가져오기
async function fetchBookmarks(userId: string): Promise<BookmarkItem[]> {
  const { data, error } = await supabase
    .from('bookmark')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return (data ?? []) as BookmarkItem[];
}

// 북마크 탭일 때만 요청
export function useFetchBookmarkList(isBookmarkSelect: boolean) {
  const userId = useAuthStore((s) => s.user?.id);

  return useQuery({
    queryKey: ['bookmarks', userId],
    queryFn: () => fetchBookmarks(userId!),
    enabled: !!userId && isBookmarkSelect,
    gcTime: 5 * 60_000,
    retry: 0,
  });
}