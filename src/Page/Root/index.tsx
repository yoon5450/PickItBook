import OverlayHost from "@/Components/Layout/OverlayHost";
import Header from "@/Components/Layout/Header";
import ScrollTopButton from "@/Components/ScrollTopButton";
import { useAuthInit } from "@/hook/useAuthInit";
import { useRootUIShellStore } from "@/store/useRootUIShellStore";
import { Outlet } from "react-router";
import Footer from "@/Components/Layout/Footer";
import { useEffect, useRef } from "react";
import supabase from "@/utils/supabase";
import { useAuthStore } from "@/store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimeChannel } from "@supabase/supabase-js";
// import ConfettiCongrats from "@/Components/ConfettiCongrats";

// 기본 레이아웃 구조 정의. 모달, floating Button등 Zustand를 통해 제어
function Root() {
  const scrollTopButtonVisible = useRootUIShellStore(
    (s) => s.scrollTopButtonVisible
  );
  useAuthInit();

  const user = useAuthStore((s) => s.user);
  const queryClient = useQueryClient();
  const channelRef = useRef<RealtimeChannel | null>(null);

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
          console.log(payload.new.template_id, "완료");
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

  return (
    <div className="min-h-screen w-full">
      {/* <ConfettiCongrats message="🎉 미션 달성" count={301} /> */}

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
