import OverlayHost from "@/Components/Layout/OverlayHost";
import Header from "@/Components/Layout/Header";
import ScrollTopButton from "@/Components/ScrollTopButton";
import { useAuthInit } from "@/hook/useAuthInit";
import { useRootUIShellStore } from "@/store/useRootUIShellStore";
import { Outlet } from "react-router";
import Footer from "@/Components/Layout/Footer";
import { useEffect, useRef, useState } from "react";
import supabase from "@/utils/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimeChannel } from "@supabase/supabase-js";
import MissionCompletePopup from "./Components/MissionCompletePopup";
// import type { Tables } from "@/@types/database.types";

// 기본 레이아웃 구조 정의. 모달, floating Button등 Zustand를 통해 제어
function Root() {
  const scrollTopButtonVisible = useRootUIShellStore(
    (s) => s.scrollTopButtonVisible
  );
  useAuthInit();

  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [missionCompletePopup, setMissionCompletePopup] = useState<boolean>(false);
  const [missionTemplateID, setMissionTemplateID] = useState<string | null>(null);
  const [isbn13, setISBN13] = useState<string | null>(null);
  // const scopeRef = useRef("");

  useEffect(() => {
    if (!user?.id) return;
    const ch = supabase
      .channel(`user:${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "task_rewards",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: ["rewards", user.id] });
          queryClient.invalidateQueries({ queryKey: ["missions", user.id] });
          console.log(payload.new, "완료");
          // const item = payload.new as Tables<"task_rewards">;
          // scopeRef.current = item.scope_id ?? "";
          setMissionTemplateID(payload.new.template_id);
          setMissionCompletePopup(true);
          setISBN13(payload.new.scope_id)
        }
      )
      .subscribe();

    channelRef.current = ch;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [user?.id, queryClient]);


  const handleClosePopup = async () => {
    // const scope_id = scopeRef.current

    // if (scope_id)
    if (isbn13)
      await Promise.all([
        queryClient.invalidateQueries({
          // queryKey: ["missions", "book", scope_id],
          queryKey: ["missions", "book", isbn13],
          refetchType: "all",
        }),
        queryClient.invalidateQueries({
          queryKey: ["rewards", user?.id],
          refetchType: "all",
        }),
      ]);

    setMissionCompletePopup(false);
    setMissionTemplateID(null);
  };


  return (
    <div className={
      missionCompletePopup
        ? "min-h-screen w-full h-screen overflow-hidden"
        : "min-h-screen w-full"
    }>
      {
        missionCompletePopup && missionTemplateID &&
        isbn13 &&
        <MissionCompletePopup
          isbn13={isbn13}
          missionCompletePopup={missionCompletePopup}
          missionTemplateID={missionTemplateID}
          onClose={handleClosePopup} />
      }

      <OverlayHost />
      <ScrollTopButton isVisible={scrollTopButtonVisible} />
      <Header />

      <div className="flex justify-center w-full">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}
export default Root;
