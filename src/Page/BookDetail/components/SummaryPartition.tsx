import { useMemo, useState } from "react";
import SummaryModal from "./SummaryModal";
import type { MissionItemType } from "@/@types/global";
import { useGetSummaryByIsbn, useSetSummary } from "@/api/useSummaryFetching";
import tw from "@/utils/tw";
import profileDefault from "/profile_default.png";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  missions?: MissionItemType[];
  isbn13?: string;
}

const SummaryPartition = ({ missions, isbn13 }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const qc = useQueryClient();

  const { mutate } = useSetSummary({onSuccess:() => {
    qc.invalidateQueries({queryKey:["getSummary", isbn13]})
  }});
  const summaryData = useGetSummaryByIsbn(isbn13);

  // 미션이 바뀔 때만 재계산됨.
  const relatedMissions = useMemo(
    () =>
      missions?.filter((item) => {
        const tf = item.code.includes("SUMMARY") && !item.completed;
        return tf;
      }),
    [missions]
  );

  return (
    <div className="w-full p-4">
      <ul className="flex flex-col gap-3">
        {summaryData.data && summaryData.data?.length < 1 && (
          <div className="flex justify-center items-center h-30">
            데이터가 없습니다.
          </div>
        )}
        {summaryData &&
          summaryData.data?.map((item) => (
            <li
              key={item.id}
              className="list-none group rounded-lg border border-gray-200 p-4 bg-white shadow-sm"
            >
              <div className="flex gap-3 items-center mb-3">
                <img
                  className="h-8 w-8 rounded-full self-start flex-shrink-0 mt-1"
                  src={item.profile_image ?? profileDefault}
                  alt="프로필 이미지"
                />{" "}
                <div>{item.nickname}</div>
              </div>
              <div className="relative flex items-center gap-3 text-gray-900">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
                  1
                </div>
                {item.line_0}
              </div>
              <div className="relative flex items-center gap-3 text-gray-900">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
                  2
                </div>
                {item.line_1}
              </div>{" "}
              <div className="flex items-center gap-3 text-gray-900">
                <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-white">
                  3
                </div>

                <div className="relative w-full min-h-9 group/third flex items-center">
                  <div
                    className={tw(
                      "absolute inset-0 flex items-center justify-center rounded-md",
                      "bg-gray-400/50 backdrop-blur-sm text-gray-600 font-semibold",
                      "transition-opacity duration-200",
                      "group-hover/third:opacity-0 group-hover/third:pointer-events-none"
                    )}
                  >
                    마우스를 올려 마지막 요약을 확인할 수 있습니다.
                  </div>
                  <p className="text-center">{item.line_2}</p>
                </div>
              </div>
            </li>
          ))}
      </ul>

      <div className="flex justify-end mt-4">
        <button
          onClick={openModal}
          className="p-3 transition text-lg font-semibold border text-white bg-primary rounded-md bg-primary-green hover:bg-inherit hover:text-primary"
        >
          3줄 요약 작성하기
        </button>
      </div>

      <SummaryModal
        isOpen={isModalOpen}
        onClose={closeModal}
        relatedMissions={relatedMissions}
        onSave={mutate}
        isbn13={isbn13}
      />
    </div>
  );
};

export default SummaryPartition;
