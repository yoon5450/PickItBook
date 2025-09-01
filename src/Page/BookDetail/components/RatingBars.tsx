type Item = { label: string; count: number };
type Props = { items: Item[]; total?: number };

export default function RatingBars({ items, total }: Props) {
  const sum = total ?? items.reduce((a, b) => a + b.count, 0);

  return (
    <ul className="space-y-4">
      {items.map((it) => {
        const pct = sum ? Math.round((it.count / sum) * 100) : 0;
        return (
          <li
            key={it.label}
            className="grid grid-cols-[3rem_1fr_auto] items-center gap-3"
          >
            {/* 왼쪽 라벨 */}
            <span className="text-m text-gray-700">{it.label}</span>

            {/* 바 트랙 */}
            <div
              className="relative rounded-full bg-gray-200 overflow-hidden h-6"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={pct}
              aria-label={`${it.label} ${pct}%`}
            >
              <div
                className="h-full rounded-full bg-amber-400 transition-[width] duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* 오른쪽 값 */}
            <span className="text-right text-m text-gray-700 tabular-nums w-20">
              {it.count} <span className="text-gray-500">({pct}%)</span>
            </span>
          </li>
        );
      })}
    </ul>
  );
}
