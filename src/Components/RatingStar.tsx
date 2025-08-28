import tw from "@/utils/tw";
import React from "react";

type BaseProps = {
  size?: number; // 별 크기(px)
  count?: number; // 별 개수(기본 5)
  gap?: number; // 별 간격(px)
  className?: string;
  showValue?: boolean; // 숫자 표시
};

type ByValue = BaseProps & { value: number; max?: number; percent?: never };

export default function RatingStars(props: ByValue) {
  const {
    size = 20,
    count = 5,
    gap = 2,
    className,
    showValue = false,
  } = props;

  const v = (props.value / (props.max ?? count)) * count;
  const ariaLabel = `${props.value} / ${props.max ?? count} stars`;

  return (
    <div
      className={`inline-flex items-center ${className ?? ""}`}
      aria-label={ariaLabel}
    >
      <div className="flex" style={{ gap }}>
        {Array.from({ length: count }).map((_, i) => {
          const fill = clamp((v - i) * 100);
          return <Star key={i} size={size} fill={fill} />;
        })}
      </div>

      {showValue && "value" in props && (
        <span className={tw("ml-2 text-black text-[20px]", 
        )}>
          {props.value.toFixed(1)}
        </span>
      )}
    </div>
  );
}

function Star({ size, fill }: { size: number; fill: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size }}>
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
        <StarIcon size={size} className="text-amber-400" />
      </div>
    </div>
  );
}

function StarIcon({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className={className}
      aria-hidden
    >
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