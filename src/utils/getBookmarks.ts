import type { Tables } from "@/@types/database.types";
import supabase from "./supabase";

export type BookmarkBook = Tables<"v_bookmark_books">

export async function getBookmarks(userId: string) {
  const { data, error } = await supabase
    .from("bookmark")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
  
  return data as (BookmarkBook)[];
}
