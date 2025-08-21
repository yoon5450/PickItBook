import { Outlet } from "react-router";

// 기본 레이아웃 구조 정의. 모달, floating Button등 Zustand를 통해 제어
function index() {
  return (
    <div>
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
export default index;
