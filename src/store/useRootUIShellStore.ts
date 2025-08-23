import { create } from "zustand";
// import { subscribeWithSelector } from "zustand/middleware"

// 타입 정의
// type ModalPayload = unknown;

// 공용 UIShellState
type UIShellState = {
  scrollTopButtonVisible:boolean;

  setScrollTopButtonVisible:(visibility:boolean) => void;
}

const Initial = {
  scrollTopButtonVisible:true,
}

export const useRootUIShellStore = create<UIShellState>()((set) => ({
  ...Initial,
  setScrollTopButtonVisible:(visibility) => set(() => ({scrollTopButtonVisible: visibility}))
})
)
