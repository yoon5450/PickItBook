import { useAuthStore } from "@/store/useAuthStore";
import { useUserMissions } from "@/api/useUserMissions";
import { BsTrophy } from "react-icons/bs";
import { FaCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Pagination from "./Pagination"; 

const PAGE_SIZE = 5; 

function MissionList() {
  const { user } = useAuthStore();
  const { data, isLoading, error } = useUserMissions(user?.id ?? "");
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;
  if (!data) return null;

  const { missions } = data;


  const sortedMissions = [...missions].sort((a, b) => {
    if (a.completed === b.completed) return 0;
    return a.completed ? 1 : -1;
  });


  const totalPages = Math.ceil(sortedMissions.length / PAGE_SIZE);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginatedMissions = sortedMissions.slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="text-lg font-semibold mb-8">Missions</div>
      {paginatedMissions.map((m) => {
        const clickable = !!m.book?.isbn13;

        return (
          <div
            key={m.id}
            role={clickable ? "button" : undefined}
            tabIndex={clickable ? 0 : -1}
            onClick={() => {
              if (m.book?.isbn13) {
                navigate(`/book_detail?isbn13=${m.book.isbn13}`);
              }
            }}
            onKeyDown={(e) => {
              if (clickable && (e.key === "Enter" || e.key === " ")) {
                e.preventDefault();
                navigate(`/book_detail?isbn13=${m.book.isbn13}`);
              }
            }}
            className={`flex items-center justify-between px-4 py-5 shadow-md rounded-lg border transition
              ${m.completed ? "border-[var(--color-primary)] bg-yellow-50" : "border-gray-300 bg-white"}
              ${clickable ? "cursor-pointer hover:shadow-md" : "cursor-default opacity-95"}
            `}
            aria-disabled={!clickable}
          >
            <div className="flex items-center gap-3">
              <BsTrophy
                className={m.completed ? "text-[var(--color-primary)]" : "text-gray-400"}
                size={24}
              />
              <div className="flex flex-col">
                <span
                  className={`${
                    m.completed ? "text-gray-500 line-through" : "text-black"
                  }`}
                >
                  {m.name}
                </span>
                {m.book?.book_name && (
                  <span className="text-sm text-gray-500">📖 {m.book.book_name}</span>
                )}
              </div>
            </div>

            <div>
              {m.completed ? (
                <FaCheckCircle className="text-[var(--color-primary)]" size={22} />
              ) : (
                <span className="text-gray-400">진행중</span>
              )}
            </div>
          </div>
        );
      })}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            maxVisible={5}
          />
        </div>
      )}
    </div>
  );
}

export default MissionList;
