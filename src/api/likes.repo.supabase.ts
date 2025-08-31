import supabase from "@/utils/supabase";

export interface ToggleLikeParams {
  review_id: number;
}

export const likeRepo = {
  toggleLike: async ({ review_id }: ToggleLikeParams) => {

    const { data, error, status } = await supabase.rpc("toggle_like", {
      p_review_id: review_id,
    });
    console.log(
      status,
      error?.code,
      error?.message,
      error?.details,
      error?.hint
    );
  },
};
