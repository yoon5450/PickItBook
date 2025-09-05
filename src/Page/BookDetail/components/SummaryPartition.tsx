import { useMemo, useState } from "react";
import SummaryModal from "./SummaryModal";
import type { MissionItemType } from "@/@types/global";

interface Props {
  missions?: MissionItemType[];
}

const SummaryPartition = ({ missions }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // 미션이 바뀔 때만 재계산됨.
  const relatedMissions = useMemo(
    () => missions?.filter((item) => {
      const tf = item.code.includes("QUOTE") && !item.completed
      return tf}),
    [missions]
  );

  console.log(relatedMissions);

  return (
    <div className="w-full">
      <button
        onClick={openModal}
        className="p-3 text-lg font-semibold text-white bg-primary rounded-md bg-primary-green"
      >
        3줄 요약 작성하기
      </button>
      <SummaryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        relatedMissions={relatedMissions}
      />
    </div>
  );
};

export default SummaryPartition;
