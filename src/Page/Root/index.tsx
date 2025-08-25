import OverlayHost from "@/Components/Layout/OverlayHost";
import ScrollTopButton from "@/Components/ScrollTopButton";
import { useRootUIShellStore } from "@/store/useRootUIShellStore";
import { Outlet } from "react-router";

// 기본 레이아웃 구조 정의. 모달, floating Button등 Zustand를 통해 제어
function Root() {
  const scrollTopButtonVisible = useRootUIShellStore((s) => s.scrollTopButtonVisible);

  return (
    <div className="min-h-screen w-full">
      <OverlayHost/>
      
      <ScrollTopButton isVisible = {scrollTopButtonVisible}/>
      <header>
        <h1>pickitBook</h1>
      </header>

      <Outlet />

      <footer>
        <small> &copy; 2025 CRA</small>
      </footer>
    </div>
  );
}
export default Root;
