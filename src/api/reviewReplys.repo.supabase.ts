import supabase from "@/utils/supabase";
import { data } from "react-router";

export const reviewReplysRepo = {
  setReply: async (content: string, parent_id: number) => {
    const { error } = await supabase
      .from("review_replys")
      .insert({ content, parent_id });

    if (error) throw Error("setReply", error);

    return data;
  },

  getReplyByParentId: async (parent_id:number) => {
    const { data, error } = await supabase
      .from("review_replys")
      .select("*")
      .eq("parent_id", parent_id);

    if (error) throw Error("getReplyByParentId", error);

    return data ?? []
  },
};
