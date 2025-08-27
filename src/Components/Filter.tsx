import { KDC_CATEGORY_OPTIONS, type KdcItemType } from "@/constant/kdc";
import tw from "@/utils/tw";
import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { throttle } from "@/utils/throttle";
import gsap from "gsap";

interface Props {
  mode?: "row" | "col";
  className?: string;
}

function Filter({ mode, className }: Props) {
  // 상위(두 번째 자리가 0) / 하위 분리
  const kdc = useMemo<KdcItemType[]>(
    () => KDC_CATEGORY_OPTIONS.filter((o) => o.code[1] === "0"),
    []
  );
  const dtlKdc = useMemo<KdcItemType[]>(
    () => KDC_CATEGORY_OPTIONS.filter((o) => o.code[1] !== "0"),
    []
  );

  // 선택 상태
  const [selectedTop, setSelectedTop] = useState<KdcItemType | null>(null);
  const [selectedBottom, setSelectedBottom] = useState<KdcItemType | null>(
    null
  );

  const filteredDetail = useMemo<KdcItemType[]>(
    () =>
      selectedTop
        ? dtlKdc.filter((o) => o.code[0] === selectedTop.code[0])
        : dtlKdc,
    [selectedTop, dtlKdc]
  );

  const listRef = useRef<HTMLUListElement | null>(null);
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const btnRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const updateCursorFor = (code: string) => {
    const cursor = cursorRef.current;
    const list = listRef.current;
    const btn = btnRefs.current[code];
    if (!cursor || !list || !btn) return;

    const h = btn.offsetHeight + 4 * 2;
    const y = btn.offsetTop + btn.offsetHeight / 2 - h / 2;

    gsap.to(cursor, {
      y,
      height: h,
      autoAlpha: 1,
      duration: 0.28,
      ease: "power3.out",
    });
  };

  useLayoutEffect(() => {
    const onResize = () => {
      if (selectedBottom) updateCursorFor(selectedBottom.code);
    };
    const throttled = throttle(onResize, 200);
    window.addEventListener("resize", throttled);
    return () => window.removeEventListener("resize", throttled);
  }, [selectedBottom]);

  useLayoutEffect(() => {
    if (selectedBottom) updateCursorFor(selectedBottom.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBottom, filteredDetail.length]);

  return (
    <div
      className={tw(
        "flex gap-10 bg-[#F5F4F1] p-10 rounded-md shadow",
        className
      )}
    >
      <div className="flex flex-col gap-6">
        {kdc.map((item) => {
          const selected = selectedTop?.code === item.code;

          return (
            <button
              key={item.code}
              className={tw(
                "flex items-center font-bold",
                selected ? "text-primary" : "text-[#303030]"
              )}
              type="button"
              onClick={() => {
                setSelectedTop(item);
                setSelectedBottom(null);
                // 왜 height를 0으로 줘도 정상적으로 안 가는 것 같을까 ?????
                if (cursorRef.current)
                  gsap.set(cursorRef.current, { autoAlpha: 0, height: 0 });
              }}
            >
              {item.value}
              <IoIosArrowForward
                size={18}
                className={tw(
                  "opacity-0 transition",
                  selected && "translate-x-5 opacity-100"
                )}
              />
            </button>
          );
        })}
      </div>

      {selectedTop && (
        <ul ref={listRef} className="flex flex-col gap-6 relative ">
          {/* 움직이는 커서 */}
          <div
            ref={cursorRef}
            className={tw(
              "pointer-events-none absolute left-0 right-0 rounded-md",
              "ring-1 ring-primary opacity-0",
              "will-change-transform"
            )}
            style={{ zIndex: 0, top: 0, left: "-8px", right: "-8px" }}
          />
          <label
            className={tw(
              "block text-sm font-bold mb-1 text-[16px]",
              !selectedBottom && "text-primary"
            )}
          >
            {selectedTop?.value} 전체
          </label>
          {filteredDetail.map((item) => (
            <li>
              <button
                type="button"
                ref={(el) => {
                  btnRefs.current[item.code] = el;
                }}
                className={tw(
                  "flex min-w-44 justify-between items-center transition",
                  item.code === selectedBottom?.code && "text-primary"
                )}
                onClick={() => {
                  if (item.code !== selectedBottom?.code) {
                    setSelectedBottom(item);
                    requestAnimationFrame(() => updateCursorFor(item.code));
                  } else {
                    setSelectedBottom(null);
                    if (cursorRef.current)
                      gsap.set(cursorRef.current, { autoAlpha: 0, height: 0, duration:0.28});
                  }
                }}
              >
                {item.value}
                {item.code === selectedBottom?.code ? (
                  <AiOutlineMinusCircle size={18} />
                ) : (
                  <AiOutlinePlusCircle size={18} />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Filter;
