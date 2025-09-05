import React, { useEffect, useRef, useState } from "react";
import tw from "@/utils/tw";
import logo from "/pickitbook_logo.svg";
import type { MissionItemType } from "@/@types/global";

interface SummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (summary: string[]) => Promise<void> | void;
  relatedMissions?: MissionItemType[];
  bookTitle?: string;
}

export default function SummaryModal({
  isOpen,
  onClose,
  onSave,
  relatedMissions,
  bookTitle,
}: SummaryModalProps) {
  const [summaryLines, setSummaryLines] = useState<string[]>(["", "", ""]);
  const [saving, setSaving] = useState(false);
  const firstInputRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSummaryChange = (index: number, value: string) => {
    setSummaryLines((prev) => prev.map((v, i) => (i === index ? value : v)));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      onSave?.(summaryLines);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const allEmpty = summaryLines.every((v) => v.trim() === "");

  return (
    <div
      className="fixed inset-0 z-[1000] flex h-screen w-screen items-center justify-center bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="summary-modal-title"
    >
      <div className="mx-4 w-full max-w-[880px] overflow-hidden rounded-2xl bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <img src={logo} alt="로고" className="h-9 w-auto" />
          <div className="min-w-0 flex-1">
            <h2
              id="summary-modal-title"
              className="truncate text-xl font-bold text-gray-900"
            >
              3줄 요약
            </h2>
            <p className="truncate text-sm text-gray-500">
              {bookTitle
                ? `${bookTitle}에 대해 3줄로 정리해 보세요.`
                : "핵심만 간결하게 기록하면 나중에 다시 볼 때 좋아요."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="inline-flex h-9 items-center justify-center rounded-md px-3 text-sm font-medium text-gray-600 ring-1 ring-gray-200 transition hover:bg-gray-50"
            aria-label="닫기"
          >
            닫기
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6 md:grid-cols-5">
          <div className="md:col-span-3">
            <div className="mb-3 flex items-center justify-end w-full">
              <span className="text-xs text-gray-400">
                Enter로 줄바꿈 가능 / 최대 140자
              </span>
            </div>
            <div className="space-y-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                    {i + 1}
                  </div>
                  <div className="relative w-full">
                    <textarea
                      ref={i === 0 ? firstInputRef : undefined}
                      value={summaryLines[i]}
                      onChange={(e) =>
                        handleSummaryChange(i, e.target.value.slice(0, 140))
                      }
                      rows={2}
                      className={tw(
                        "w-full resize-none rounded-lg border border-gray-300 bg-white/80 p-3 text-sm text-gray-900 shadow-sm",
                        "placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
                      )}
                      placeholder={`요약 ${i + 1}`}
                      aria-label={`요약 ${i + 1}`}
                    />
                    <span className="pointer-events-none absolute bottom-3 right-2 text-xs text-gray-400">
                      {summaryLines[i].length}/140
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {relatedMissions && relatedMissions.length && (
            <div className="md:col-span-2">
              <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <span className="inline-flex h-6 items-center rounded-md bg-amber-500/10 px-2 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                    미션 연동
                  </span>
                  <span className="text-sm text-amber-800">
                    이 책과 연관된 미션이{" "}
                    {relatedMissions && relatedMissions.length}개 있어요
                  </span>
                </div>
                <ul className="space-y-2">
                  {relatedMissions &&
                    relatedMissions.map((m) => (
                      <li
                        key={m.template_id}
                        className={tw(
                          "flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-amber-200"
                        )}
                      >
                        <span className="truncate text-sm font-medium text-amber-900">
                          {m.description}
                        </span>
                        {!m.assigned && <span className="text-amber-700">아직 미션을 수령하지 않았어요!</span>} 
                        {m.reward && (
                          <span className="ml-3 shrink-0 text-xs text-red-600">
                            {m.reward.amount}
                          </span>
                        )}
                      </li>
                    ))}
                </ul>
                <p className="mt-3 text-xs text-amber-800/80">
                  요약을 저장하면 해당 미션 진행도가 자동으로 갱신됩니다.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-gray-100 px-5 text-sm font-semibold text-gray-700 transition hover:bg-gray-200"
          >
            취소
          </button>
          <button
            onClick={handleSave}
            disabled={saving || allEmpty}
            className={tw(
              "inline-flex h-10 items-center justify-center rounded-lg px-5 text-sm font-semibold text-white transition",
              allEmpty || saving ? "bg-gray-300" : "bg-gray-900 hover:bg-black"
            )}
          >
            {saving ? "저장 중..." : "저장"}
          </button>
        </div>
      </div>
    </div>
  );
}
