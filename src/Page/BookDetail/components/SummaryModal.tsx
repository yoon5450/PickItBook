import { useEffect, useRef, useState } from "react";
import tw from "@/utils/tw";
import logo from "/pickitbook_logo.svg";
import type { MissionItemType } from "@/@types/global";
import type { UseMutateFunction } from "@tanstack/react-query";
import type { SetSummaryType } from "@/api/summary.repo.supabase";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave?: UseMutateFunction<unknown, Error, SetSummaryType, unknown>;
  relatedMissions?: MissionItemType[];
  bookTitle?: string;
  isbn13?: string;
}

export default function SummaryModal({
  isOpen,
  onClose,
  onSave,
  bookTitle,
  isbn13,
}: Props) {
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
      onSave?.({ summary: summaryLines, isbn13 });
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
