import { useState } from "react";
import SummaryModal from "./SummaryModal";

const SummaryPartition = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);



  return (
    <div className="w-full">
      <button
        onClick={openModal}
        className="p-3 text-lg font-semibold text-white bg-primary rounded-md bg-primary-green"
      >
        3줄 요약 작성하기
      </button>
      <SummaryModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default SummaryPartition;
