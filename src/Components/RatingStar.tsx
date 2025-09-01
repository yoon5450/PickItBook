import tw from "@/utils/tw";
import React, {
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

type BaseProps = {
  size?: number; // 별 크기(px)
  count?: number; // 별 개수(기본 5)
  gap?: number; // 별 간격(px)
  className?: string;
  showValue?: boolean; // 숫자 표시
  inputMode?: boolean;
  onClick?: boolean;
};

type ByValue = BaseProps & {
  value: number;
  max?: number;
  percent?: never;
  setter?: Dispatch<SetStateAction<number>>;
};

export default function RatingStars(props: ByValue) {
  const { size = 20, count = 5, gap = 2, className, showValue = false } = props;
  const init = (props.value / (props.max ?? count)) * count;
  const [curValue, setCurValue] = useState(() => init);
  const ariaLabel = `${props.value} / ${props.max ?? count} stars`;
  const prevValue = useRef(0);

  useEffect(() => {
    const newInit = (props.value / (props.max ?? count)) * count;
    const newCurValue = newInit;
    setCurValue(newCurValue);
  }, [props.value, props.max, count]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    if (!target) return;

    const rect = target.getBoundingClientRect();
    const offsetX = e.clientX - rect.left + size / 2;

    const raw = (offsetX / target.offsetWidth) * count;
    const v = snap(raw, 1, 1, count);
    setCurValue(v);
  };

  return (
    <div
      className={`inline-flex items-center ${className ?? ""}`}
      aria-label={ariaLabel}
    >
      <div
        className="flex"
        style={{ gap }}
        onMouseMove={props.inputMode ? handleMove : undefined}
        onClick={
          props.inputMode
            ? () => {
                if (props.setter) {
                  props.setter(curValue);
                  prevValue.current = curValue;
                }
              }
            : undefined
        }
        onMouseLeave={
          props.inputMode
            ? () => {
                setCurValue(prevValue.current);
              }
            : undefined
        }
      >
        {Array.from({ length: count }).map((_, i) => {
          const fill = clamp((curValue - i) * 100);
          return <Star key={i} size={size} fill={fill} className={fill ? "text-amber-400" : ""} />;
        })}
      </div>

      {showValue && "value" in props && (
        <span className={tw("ml-2 text-black text-[20px]")}>
          {curValue.toFixed(1)}
        </span>
      )}
    </div>
  );
}

function Star({ size, fill, className }: { size: number; fill: number; className:string }) {
  return (
    <div style={{ position: "relative", width:"fit-content"  ,height:"fit-content" }}>
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

function snap(value: number, step = 0.5, min = 0, max = Infinity) {
  const v = Math.round(value / step) * step;
  return Math.max(min, Math.min(max, v));
}
