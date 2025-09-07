import type { MissionItemType } from "@/@types/global";

interface Props {
  relatedMissions?: MissionItemType[];
}

function RelatedMissionsInfo({ relatedMissions }: Props) {
  return (
    <>
      {relatedMissions && relatedMissions.length > 0 && (
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
                    className="flex items-center justify-between rounded-lg bg-white px-3 py-2 ring-1 ring-amber-200"
                  >
                    <span className="truncate text-sm font-medium text-amber-900 w-1/2">
                      {m.description}
                    </span>
                    {!m.assigned && (
                      <span className="text-amber-700">
                        아직 미션을 수령하지 않았어요!
                      </span>
                    )}
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
    </>
  );
}
export default RelatedMissionsInfo;
