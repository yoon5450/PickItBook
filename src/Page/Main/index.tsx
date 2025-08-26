import { useMainStore } from "@/store/mainStore";
import supabase from "@/utils/supabase";
import Swal from "sweetalert2";
import Logout from "../Auth/Components/Logout";

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

      <button type="button" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
        구글 로그인 테스트
      </button>
      <hr />
      <Logout />
    </div>
  );
}
export default Main;
