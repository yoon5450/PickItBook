import supabase from "@/utils/supabase";

export const bookmarkRepo = {
  bookmarkWithMissions: async (isbn13: string) => {
    const { data, error } = await supabase.rpc("api_bookmark_with_missions", {
      p_isbn13: isbn13,
    });

    if (error) console.error("bookmarkWithMissions error", error);

    return data;
  },

  toggleBookmark: async (isbn13: string) => {
    const { data, error } = await supabase.rpc("api_toggle_bookmark", {p_isbn13: isbn13});

    if (error) console.error("toggleBookmark error", error);

    const toggled = data?.[0];

    return toggled;
  },

  isBookmarked: async (isbn13: string) => {
    const {
      data: { user },
      error:authError,
    } = await supabase.auth.getUser();

    if(authError){
      console.error("auth error:", authError);
      return false
    }

    const { data, error:checkError } = await supabase
      .from("bookmark")
      .select("*")
      .eq("isbn13", isbn13)
      .eq("user_id", user?.id)

    if(checkError) console.log("check Error:", checkError);
    if(data) return data?.length > 0
    else return false
  },
};
