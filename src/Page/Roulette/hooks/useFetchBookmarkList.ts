import type { BookmarkItem } from "@/@types/global";
import { useAuthStore } from "@/store/useAuthStore";
import supabase from "@/utils/supabase";
import { useEffect, useState } from "react";

export function useFetchBookmarkList(isBookmarkSelect: boolean): BookmarkItem[] | null {
  const [bookmarkData, setBookmarkData] = useState<BookmarkItem[] | null>(null);
  const user_id = useAuthStore((s) => s.user?.id);
  console.log(user_id);

  const fetchData = async () => {
    const { data, error } = await supabase
      .from('bookmark')
      .select('*')
      .match({
        user_id
      });

    if (error) return console.error('북마크 데이터 가져오기 실패');
    setBookmarkData(data);
  }

  useEffect(() => {
    fetchData();
    console.log('슈파베이스에서 따끈하게 나온 북마크 리스트 : ', bookmarkData);
  }, [user_id, isBookmarkSelect])

  return bookmarkData
}