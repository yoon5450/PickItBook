import React, { useMemo } from "react";
import styles from "./ConfettiCongrat.module.css";

type Piece = {
  left: number;      // 0 ~ 100 (vw%)
  size: number;      // px
  rotate: number;    // deg
  opacity: number;   // 0.5 ~ 1.5 (clamped in CSS)
  duration: number;  // s
  delay: number;     // s
  drift: number;     // -15 ~ 15 (vw)
  color: string;     // hex
};

type Props = {
  count?: number;
  colors?: string[];
  message?: string;
  minDuration?: number; // s
  maxDuration?: number; // s
  maxDriftVW?: number;  // vw
  className?: string;
};

const DEFAULT_COLORS = ["#d13447", "#ffbf00", "#263672"];

export default function ConfettiCongrats({
  count = 301,
  colors = DEFAULT_COLORS,
  message = "Congratulations on 50,000 Stargazers! 🎉",
  minDuration = 4,
  maxDuration = 5,
  maxDriftVW = 15,
  className,
}: Props) {
  const pieces = useMemo<Piece[]>(() => {
    const rand = (min: number, max: number) => Math.random() * (max - min) + min;
    const arr: Piece[] = [];
    for (let i = 0; i < count; i++) {
      const size = Math.floor(rand(1, 8)); // 원본 random(8)
      arr.push({
        left: Math.floor(rand(0, 100)),
        size,
        rotate: Math.floor(rand(0, 360)),
        opacity: rand(0.5, 1.5),
        duration: rand(minDuration, maxDuration),
        delay: rand(0, 1), // 원본 random()s
        drift: rand(-maxDriftVW, maxDriftVW),
        color: colors[Math.floor(rand(0, colors.length))],
      });
    }
    return arr;
  }, [count, colors, minDuration, maxDuration, maxDriftVW]);

  return (
    <div className={`${styles.wrapper} ${className ?? ""}`}>
      <div className={styles.wohoo}>
        <span className={styles.txt}>{message}</span>
      </div>

      {pieces.map((p, i) => (
        <div
          key={i}
          className={styles.piece}
          style={
            {
              // 위치/스타일을 CSS 변수로 넘김 → 단일 keyframes로 개별화
              "--left": `${p.left}vw`,
              "--size": `${p.size}px`,
              "--rot": `${p.rotate}deg`,
              "--opacity": p.opacity,
              "--bg": p.color,
              "--duration": `${p.duration}s`,
              "--delay": `${p.delay}s`,
              "--drift": `${p.drift}vw`,
            } as React.CSSProperties
          }
        />
      ))}

    </div>
  );
}
