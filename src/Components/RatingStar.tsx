import tw from "@/utils/tw";
import React, { useEffect, useMemo, useState } from "react";

type BaseProps = {
  size?: number;
  count?: number;
  gap?: number;
  className?: string;
  showValue?: boolean;
  inputMode?: boolean;
};

type ByValue = BaseProps & {
  value: number;
  max?: number;
  setter?: React.Dispatch<React.SetStateAction<number>>;
};

export default function RatingStars(props: ByValue) {
  const { size = 20, count = 5, gap = 2, className, showValue = false } = props;

  const base = useMemo(
    () => (props.value / (props.max ?? count)) * count,
    [props.value, props.max, count]
  );

  // 화면 표시용 현재 값(호버 시에만 바뀜)
  const [curValue, setCurValue] = useState(base);

  useEffect(() => {
    setCurValue(base);
  }, [base]);

  const ariaLabel = `${props.value} / ${props.max ?? count} stars`;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const rect = target.getBoundingClientRect();

    const offsetX = e.clientX - rect.left;

    const raw = (offsetX / target.offsetWidth) * count;
    const v = snap(raw, 0.5, 1, count);
    setCurValue(v);
  };

  return (
    <div className={`inline-flex items-center ${className ?? ""}`} aria-label={ariaLabel}>
      <div
        className="flex"
        style={{ gap }}
        onMouseMove={props.inputMode ? handleMove : undefined}
        onClick={
          props.inputMode
            ? () => {
                props.setter?.(curValue);
              }
            : undefined
        }
        onMouseLeave={
          props.inputMode
            ? () => {
                setCurValue(base);
              }
            : undefined
        }
      >
        {Array.from({ length: count }).map((_, i) => {
          const fill = clamp((curValue - i) * 100);
          return (
            <Star
              key={i}
              size={size}
              fill={fill}
              className={fill ? "text-amber-400" : ""}
            />
          );
        })}
      </div>

      {showValue && (
        <span className={tw("ml-2 text-black text-[20px]")}>{curValue.toFixed(1)}</span>
      )}
    </div>
  );
}

function Star({
  size,
  fill,
  className,
}: {
  size: number;
  fill: number;
  className: string;
}) {
  return (
    <div style={{ position: "relative", width: "fit-content", height: "fit-content" }}>
      <StarIcon size={size} className="text-gray-300" />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "hidden",
          width: `${fill}%`,
        }}
      >
        <StarIcon size={size} className={tw("text-amber-200 transition", className)} />
      </div>
    </div>
  );
}

function StarIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} className={className} aria-hidden>
      <path
        fill="currentColor"
        d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}

function clamp(n: unknown) {
  const num = Number(n);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, num));
}

function snap(value: number, step = 0.5, min = 0, max = Infinity) {
  const v = Math.round(value / step) * step;
  return Math.max(min, Math.min(max, v));
}
