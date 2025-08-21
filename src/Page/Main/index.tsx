import { useMainStore } from "@/store/mainStore";
import Swal from "sweetalert2";

function Main() {
  const id = useMainStore((s) => s.id);
  const num = useMainStore((s) => s.num);

  return (
    <div className="h-screen">
      메인페이지입니다.
      <button
        type="button"
        onClick={() =>
          Swal.fire({ title: "swal 테스트", icon: "info", text: id + num })
        }
      >
        swal 호출
      </button>
    </div>
  );
}
export default Main;
