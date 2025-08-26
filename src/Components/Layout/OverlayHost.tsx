import { useRootUIShellStore } from "@/store/useRootUIShellStore";
import { useLocation } from "react-router";
import { useEffect } from "react";
import React from "react";
import ImagePreview from "../ImagePreview";
import { createPortal } from "react-dom";

// 추가하고 싶은 컴포넌트가 있다면 여기에 추가
// 코드 스플리팅
const registry = {
  imagePreview: ImagePreview,
} satisfies Record<string, React.ComponentType<HTMLElement>>;

function OverlayHost() {
  const modalMap = useRootUIShellStore((s) => s.modalMap);
  const layerCount = useRootUIShellStore((s) => s.layerCount);
  const setInitial = useRootUIShellStore((s) => s.setInitial);
  const location = useLocation();

  // ESC로 모달 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInitial();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setInitial]);

  // 주소가 바뀌었을 때 모달 닫기
  useEffect(() => {
    setInitial();
  }, [location.pathname, location.search, location.hash]);

  // useRootUIShellStore 구독 처리
  useEffect(() => {
    const unsubscribe = useRootUIShellStore.subscribe(
      (s) => s.layerCount,
      (cur, prev) => {
        if (cur && !prev) document.body.style.overflow = "hidden";
        if (!cur && prev) document.body.style.overflow = "";
      }
    );
    return unsubscribe;
  }, []);

  // 포탈 루트 보장
  useEffect(() => {
    if (!document.getElementById("portal-root")) {
      const el = document.createElement("div");
      el.id = "portal-root";
      document.body.appendChild(el);
    }
  }, []);
  const portal = document.getElementById("portal-root");
  if (!portal) return null;

  return createPortal(
    <>
      {layerCount > 0 ? (
        <div className="fixed inset-0 z-[1000] bg-black/40 flex items-center justify-center">
          <div
            className="fixed inset-0 z-[1010] flex items-center justify-center"
            onClick={(e) => {
              if (e.target === e.currentTarget) setInitial();
            }}
          >
            {Object.entries(modalMap).map(([id, state]) => {
              if (!state?.open) return null;
              const Cmp = registry[id as keyof typeof registry];
              return Cmp ? <Cmp key={id} /> : null;
            })}
          </div>
        </div>
      ) : null}
    </>,
    portal
  );
}
export default OverlayHost;
