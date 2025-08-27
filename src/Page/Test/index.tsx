import { useMainStore } from "@/store/mainStore";
import { useRootUIShellStore } from "@/store/useRootUIShellStore";
import supabase from "@/utils/supabase";
import Swal from "sweetalert2";

function Test() {
  const id = useMainStore((s) => s.id);
  const num = useMainStore((s) => s.num);
  const openModal = useRootUIShellStore(s => s.openModal)

  return (
    <div className="h-screen py-40 bg-pattern">
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

      <button type="button" className="bg-amber-300" onClick={() => openModal('imagePreview')}>
        모달 열기 테스트
      </button>

      <button type="button" className="bg-gray-800 text-white"
        onClick={async () => {
          await supabase.auth.signOut()
        }} >로그아웃</button>

    </div>
  );
}
export default Test;
