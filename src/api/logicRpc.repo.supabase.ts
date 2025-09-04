import type { EventType } from "@/@types/global";
import supabase from "@/utils/supabase";

export const logicRpcRepo = {
  // 결정적 난수로 미션 목록을 뽑아 유저에게 부여합니다. (task, bundle 등 처리)
  setBundle: async (isbn13: string) => {
    const { error } = await supabase.rpc("api_assign_book_tasks", {
      p_isbn13: isbn13,
    });

    if (error) console.error("setBundle error :", error);

    return await logicRpcRepo.getBundleIdByISBN(isbn13);
  },

  // 유저의 행동에 대한 이벤트 로그를 부여합니다. ( 리뷰 작성, 북마크 추가 등 )
  setProcessEvent: async <T>(type: EventType, payload: T) => {
    const { error } = await supabase.rpc("api_process_event", {
      p_type: type,
      p_payload: payload,
    });

    if (error) console.error("processEvent error :", error);
  },

  // isbn에 대한 미션 번들 번호를 받아옵니다.
  getBundleIdByISBN: async (isbn13: string) => {
    const { data, error } = await supabase
      .rpc("fn_pick_bundle_by_isbn", {
        p_isbn: isbn13,
      })
      .select("*");

    if (error) {
      console.error(error);
      return;
    }

    console.log(data);
  },
};
