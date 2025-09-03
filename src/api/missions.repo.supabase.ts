import supabase from "@/utils/supabase";

export const missionsRepo = {
  // ISBN 기반한 미션 목록을 받아옵니다.
  // 추가 포함 데이터 : assigned - 이 미션을 수락했는지, bundle_id - 미션의 번들 id
  // args : , p_user_id : null이면 서버에서 auth.uid(), p_auto_assign:
  getMissionsByISBN: async (isbn13: string) => {
    const { data, error } = await supabase.rpc("api_list_book_missions", {
      p_isbn13: isbn13,
      p_user_id: null,
      p_auto_assign: false,
    });
    if (error) throw Error("getMissionsByISBN ", error);

    return data;
  },

  // 유저의 미션 데이터를 가져옵니다.
  getMyMissions: async () => {
    const { data, error } = await supabase.rpc("api_get_my_tasks", {
      p_completed: null, // 완료된 것만
      p_scope_id: null, // 전체
      p_template_code: null, // 전체
      p_limit: 20,
      p_offset: 0,
    });

    if(error) throw new Error("getMyMissions ", error);

    return data
  },
};
