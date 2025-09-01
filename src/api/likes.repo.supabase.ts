import supabase from "@/utils/supabase";

export interface ToggleLikeParams {
  review_id: number;
}

export type ToggleLikeResult = { liked: boolean; like_count: number };

export const likeRepo = {
  toggleLike: async ({
    review_id,
  }: {
    review_id: number;
  }): Promise<ToggleLikeResult> => {
    const { data, error } = await supabase
      .rpc("toggle_like", { p_review_id: review_id })
      .single<ToggleLikeResult>();
    if (error) throw error;
    return data;
  },
};
