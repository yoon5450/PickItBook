import OverlayHost from "@/Components/Layout/OverlayHost";
import Header from "@/Components/Layout/Header";
import ScrollTopButton from "@/Components/ScrollTopButton";
import { useRootUIShellStore } from "@/store/useRootUIShellStore";
import { Outlet } from "react-router";
import Footer from "@/Components/Layout/Footer";

// 기본 레이아웃 구조 정의. 모달, floating Button등 Zustand를 통해 제어
function Root() {
  const scrollTopButtonVisible = useRootUIShellStore(
    (s) => s.scrollTopButtonVisible
  );

  return (
    <div className="min-h-screen w-full">
      <OverlayHost/>
      <ScrollTopButton isVisible = {scrollTopButtonVisible}/>
      <Header />

      <Outlet />

      <Footer />
    </div>
  );
}
export default Root;
