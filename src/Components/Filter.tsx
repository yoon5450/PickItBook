import tw from "@/utils/tw";
import { useLayoutEffect, useMemo, useRef } from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { AiOutlineMinusCircle } from "react-icons/ai";
import { throttle } from "@/utils/throttle";
import gsap from "gsap";
import type { KdcItemType } from "@/constant/kdc";

type filterType = KdcItemType;

interface Props {
  isOpen?: boolean
  topItems: KdcItemType[] | null;
  bottomItems?: KdcItemType[] | null;
  className?: string;
  styleTopItems?: string;
  styleBottomTotal?: string;
  styleBottomItems?: string;
  filterItem: { top?: KdcItemType; bottom?: KdcItemType } | null;
  setFilterItem: React.Dispatch<React.SetStateAction<{
    top?: KdcItemType
    bottom?: KdcItemType
  } | null>>
  onClose?: () => void;
}

function Filter({
  isOpen,
  topItems,
  bottomItems,
  filterItem,
  className,
  styleTopItems,
  styleBottomTotal,
  styleBottomItems,
  setFilterItem,
  onClose
}: Props) {

  // 상위(두 번째 자리가 0) / 하위 분리
  const filteredDetail = useMemo<filterType[]>(() => {
    if (!bottomItems || !filterItem?.top) return [];
    return filterItem?.top
      ? bottomItems.filter((o) => o.code[0] === filterItem?.top?.code[0])
      : bottomItems;
  }, [filterItem?.top?.code, bottomItems]);

  const panelRef = useRef<HTMLDivElement>(null); // 외부 영역 지정
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

  // 필터 초기값 설정
  useLayoutEffect(() => {
    if (!isOpen) return;
    if (!filterItem?.top && topItems && topItems.length > 0) {
      setFilterItem({ top: topItems[0], bottom: bottomItems?.[0] });          // 기본 top
      if (cursorRef.current) gsap.set(cursorRef.current, { autoAlpha: 0, height: 0 }); // 커서 숨김
    }
  }, [isOpen, topItems, filterItem?.top, setFilterItem]);

  // 외부 영역 클릭시 닫히게
  useLayoutEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (panelRef.current && panelRef.current.contains(t)) return;
      onClose?.();
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isOpen, onClose]);

  useLayoutEffect(() => {
    const onResize = () => {
      if (filterItem?.bottom) updateCursorFor(filterItem?.bottom.code);
    };
    const throttled = throttle(onResize, 200);
    window.addEventListener("resize", throttled);
    return () => window.removeEventListener("resize", throttled);
  }, [filterItem]);

  useLayoutEffect(() => {
    if (filterItem?.bottom) updateCursorFor(filterItem.bottom.code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterItem, filteredDetail.length]);

  return (
    isOpen &&
    <div
      ref={panelRef}
      className={tw(
        "flex p-10 shadow-sm py-5 gap-7 rounded-xl bg-pattern z-10",
        className
      )}
    >
      <div className="flex flex-col gap-4">
        {topItems?.map((item) => {
          const selected = filterItem?.top?.code === item.code;
          return (
            <button
              key={item.code}
              className={tw(
                "flex w-fit rounded-xl py-1 px-3 transition hover:bg-primary/50 hover:text-white text-nowrap",
                selected ? "bg-primary text-white" : "text-[#303030]",
                styleTopItems
              )}
              type="button"
              onClick={() => {
                setFilterItem({ top: item });
                if (cursorRef.current)
                  gsap.set(cursorRef.current, { autoAlpha: 0, height: 0 });
              }}
            >
              {item.value}
            </button>
          );
        })}
      </div>

      {filterItem?.top && filteredDetail.length > 0 && (
        <ul ref={listRef} className="flex flex-col gap-6 relative ">
          {/* 움직이는 커서 */}
          <div
            ref={cursorRef}
            className={tw(
              "pointer-events-none absolute left-0 right-0 rounded-xl",
              "ring-1 ring-primary opacity-0",
              "will-change-transform"
            )}
            style={{ zIndex: 0, top: 0, left: "-8px", right: "-8px" }}
          />
          <label
            className={tw(
              "block text-sm font-bold mb-1 text-[16px]",
              !filterItem.bottom && "text-primary",
              styleBottomTotal
            )}
          >
            {filterItem.top?.value} 전체
          </label>
          {filteredDetail.map((item, index) => (
            <li key={index}>
              <button
                type="button"
                ref={(el) => {
                  btnRefs.current[item.code] = el;
                }}
                className={tw(
                  "flex min-w-44 justify-between items-center transition hover:text-primary",
                  item.code === filterItem.bottom?.code && "text-primary",
                  styleBottomItems
                )}
                onClick={() => {
                  if (item.code !== filterItem.bottom?.code) {
                    setFilterItem({ ...filterItem, bottom: item });
                    requestAnimationFrame(() => updateCursorFor(item.code));
                  } else {
                    setFilterItem({ top: filterItem.top });
                    if (cursorRef.current)
                      gsap.to(cursorRef.current, {
                        autoAlpha: 0,
                        height: 0,
                        duration: 0.28,
                      });
                  }
                }}
              >
                {item.value}
                {item.code === filterItem.bottom?.code ? (
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

