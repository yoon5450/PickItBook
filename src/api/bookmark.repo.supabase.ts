import supabase from "@/utils/supabase";

export const bookmarkRepo = {
  toggleBookmark: async (isbn13: string) => {
    const { data, error } = await supabase.rpc("api_toggle_bookmark", isbn13);

    if (error) console.error("toggleBookmark error", error);

    const toggled = data?.[0];

    return toggled;
  },
};
