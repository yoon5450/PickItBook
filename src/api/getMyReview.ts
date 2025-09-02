
import type { Tables } from "@/@types/database.types";
import supabase from "@/utils/supabase";


type ReviewRow = Tables<"review">;

export async function getMyReviews(userId: string, limit: number, offset: number) {
  const { data, error, count } = await supabase
    .from("review")
    .select("*", { count: "exact" })
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.error("리뷰 불러오기 오류:", error);
    return { data: [] as ReviewRow[], count: 0 };
  }

  return { data: (data as ReviewRow[]) ?? [], count: count ?? 0 };
}