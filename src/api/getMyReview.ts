import type { Database } from "@/@types/database.types";
import supabase from "@/utils/supabase";

type Review = Database["public"]["Tables"]["review"]["Row"];

export async function getMyReviews(userId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from("review")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("리뷰 불러오기 오류:", error);
    return [];
  }
  return data;
}
