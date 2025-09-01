import supabase from "@/utils/supabase";

export const logicRpcRepo = {
  setBundle: async (isbn13: string) => {
    const { error } = await supabase.rpc("api_assign_book_tasks", {
      p_user_id: null,
      p_isbn13: isbn13,
    });
    
    console.error("setBundle error :", error);
  },
  processEvent: async <T>(type: string, payload: T) => {
    const { error } = await supabase.rpc("api_process_event", {
      p_type: type,
      p_payload: payload,
    });

    console.error("processEvent error :", error);
  },
};
