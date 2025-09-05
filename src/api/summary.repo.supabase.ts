import supabase from "@/utils/supabase";

export interface SetSummaryType {
  summary: string[];
  isbn13: string | undefined;
}

export const summaryRepo = {
  setSummary: async (summary: string[], isbn13: string | undefined) => {
    const { data, error } = await supabase
      .from("summary")
      .insert({
        line_0: summary[0],
        line_1: summary[1],
        line_2: summary[2],
        isbn13,
      })
      .select("id")
      .single();

    if (error) throw new Error("setSummary", error);
    return data as { id: number };
  },

  getSummaryByIsbn: async (isbn13: string | undefined) => {
    const { data, error } = await supabase
      .from("v_summary_with_author")
      .select("*")
      .eq("isbn13", isbn13);

    if (error) throw new Error("getSummaryByIsbn", error);

    return data ?? [];
  },
};
