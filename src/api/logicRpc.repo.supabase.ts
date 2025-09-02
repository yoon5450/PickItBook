import type { EventType } from "@/@types/global";
import supabase from "@/utils/supabase";

export const logicRpcRepo = {
  setBundle: async (isbn13: string) => {
    const { error } = await supabase.rpc("api_assign_book_tasks", {
      p_isbn13: isbn13,
    });
    if (error) console.error("setBundle error :", error);

    return await logicRpcRepo.getBundleIdByISBN(isbn13)
  },

  setProcessEvent: async <T>(type: EventType, payload: T) => {
    const { error } = await supabase.rpc("api_process_event", {
      p_type: type,
      p_payload: payload,
    });

    if (error) console.error("processEvent error :", error);
  },
  
  getBundleIdByISBN: async (isbn13: string) => {
    const { data, error } = await supabase
      .rpc("fn_pick_bundle_by_isbn", {
        p_isbn: isbn13,
      })
      .select("*");

    if (error) {
      console.error(error);
      return
    }

    console.log(data);
  },
};
