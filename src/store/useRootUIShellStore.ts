import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";

// TODO : props unknown 변경

// 타입 정의
type ModalPayload = unknown;

type OverlayState = {
  layerCount: number;
  modalMap: Record<string, { open: boolean; props?: Record<string, unknown>; }>;
  isOpenSidebar: boolean;
};

// 공용 UIShellState
type UIShellState = {
  layerCount: number;
  scrollTopButtonVisible: boolean;
  modalMap: Record<string, { open: boolean; props?: Record<string, unknown>; }>;
  isOpenSidebar: boolean;

  openModal: (id: string, payload?: ModalPayload) => void;
  closeModal: (id: string) => void;

  openSidebar: () => void;
  closeSidebar: () => void;

  setScrollTopButtonVisible: (visibility: boolean) => void;
  setInitial: () => void;
};

// State 초기화
const OVERLAYINITIAL: OverlayState = {
  layerCount: 0,
  modalMap: {},
  isOpenSidebar: false,
};

// Store 생성 : subscribeWithSelector로 사이드이펙트 제어
export const useRootUIShellStore = create<UIShellState>()(
  subscribeWithSelector((set) => ({
    ...OVERLAYINITIAL,
    scrollTopButtonVisible: true,

    openModal: (id, payload) =>
      set((s) => {
        const wasOpen = s.modalMap?.open ?? false;
        return {
          modalMap: { ...s.modalMap, [id]: { open: true, payload } },
          layerCount: s.layerCount + (wasOpen ? 0 : 1),
        };
      }),
    closeModal: (id) =>
      set((s) => {
        const wasOpen = s.modalMap[id]?.open ?? false;
        if (!wasOpen) return s;
        const next = {
          ...s.modalMap,
          [id]: { ...s.modalMap[id], open: false },
        };
        return { modalMap: next, layerCount: Math.max(0, s.layerCount - 1) };
      }),

    openSidebar: () =>
      set((s) => ({
        isOpenSidebar: true,
        layerCount: s.layerCount + (s.isOpenSidebar ? 1 : 0),
      })),

    closeSidebar: () =>
      set((s) => ({
        isOpenSidebar: false,
        layerCount: s.layerCount + (s.isOpenSidebar ? 1 : 0),
      })),

    setInitial: () => set((s) => ({ ...s, ...OVERLAYINITIAL })),

    setScrollTopButtonVisible: (visibility) =>
      set(() => ({ scrollTopButtonVisible: visibility })),
  }))
);
