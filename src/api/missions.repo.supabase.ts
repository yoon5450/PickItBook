import supabase from "@/utils/supabase";

export const missionsRepo = {
  getMissionsByISBN: async (isbn13: string) => {
    const { data, error } = await supabase.rpc("api_list_book_missions", {
      p_isbn13: isbn13,
      p_user_id: null,
      p_auto_assign: true,
    });
    if (error) throw Error("getMissionsByISBN", error);

    return data;
  },
};
