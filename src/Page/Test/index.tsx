import { useMainStore } from "@/store/mainStore";
import { useRootUIShellStore } from "@/store/useRootUIShellStore";
import supabase from "@/utils/supabase";
import Swal from "sweetalert2";
import { useMemo, useState } from "react";
import { KDC_CATEGORY_OPTIONS, type KdcItemType } from "@/constant/kdc";
import Filter from "@/Components/Filter";


function Test() {
  const id = useMainStore((s) => s.id);
  const num = useMainStore((s) => s.num);
  const openModal = useRootUIShellStore((s) => s.openModal);
  const [filterItem, setFilterItem] = useState<{top?:KdcItemType, bottom?:KdcItemType} | null>(null)

    const topItems = useMemo<KdcItemType[]>(
      () => KDC_CATEGORY_OPTIONS.filter((o) => o.code[1] === "0"),
      []
    );
    const bottomItems = useMemo<KdcItemType[]>(
      () => KDC_CATEGORY_OPTIONS.filter((o) => o.code[1] !== "0"),
      []
    );

  console.log(filterItem);
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
      <button
        type="button"
        onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
      >
        구글 로그인 테스트
      </button>
      <button
        type="button"
        className="bg-amber-300 block"
        onClick={() => openModal("imagePreview")}
      >
        모달 열기 테스트
      </button>

      <button
        type="button"
        className="bg-amber-300 block"
        onClick={() => openModal("userModal")}
      >
        모달 전환 테스트
      </button>


      <button type="button" className="bg-gray-800 text-white"
        onClick={async () => {
          await supabase.auth.signOut()
        }} >로그아웃</button>


      <Filter topItems={topItems} bottomItems={bottomItems} filterItem={filterItem} setFilterItem={setFilterItem} />
    </div>
  );
}
export default Test;
