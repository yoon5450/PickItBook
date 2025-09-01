import tw from "@/utils/tw";

interface Props {
  className?: string;
  color?: string;
}

const Loading = ({ className = "", color = "#292929" }: Props) => {
  const pages = Array.from({ length: 18 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={tw("flex items-center justify-center scale-75", className)}
      >
        <div
          className="relative"
          style={
            {
              "--color": color,
              "--duration": "6.8s",
            } as React.CSSProperties
          }
        >
          <style jsx>{`
            .book-container {
              width: 32px;
              height: 12px;
              position: relative;
              margin: 32px 0 0 0;
            }

            .book-inner {
              width: 32px;
              height: 12px;
              position: relative;
              transform-origin: 2px 2px;
              transform: rotateZ(-90deg);
              animation: book var(--duration) ease infinite;
            }

            .book-left,
            .book-right {
              width: 60px;
              height: 4px;
              top: 0;
              border-radius: 2px;
              background: var(--color);
              position: absolute;
            }

            .book-left::before,
            .book-right::before {
              content: "";
              width: 48px;
              height: 4px;
              border-radius: 2px;
              background: inherit;
              position: absolute;
              top: -10px;
              left: 6px;
            }

            .book-left {
              right: 28px;
              transform-origin: 58px 2px;
              transform: rotateZ(90deg);
              animation: left var(--duration) ease infinite;
            }

            .book-right {
              left: 28px;
              transform-origin: 2px 2px;
              transform: rotateZ(-90deg);
              animation: right var(--duration) ease infinite;
            }

            .book-middle {
              width: 32px;
              height: 12px;
              border: 4px solid var(--color);
              border-top: 0;
              border-radius: 0 0 9px 9px;
              transform: translateY(2px);
            }

            .book-pages {
              margin: 0;
              padding: 0;
              list-style: none;
              position: absolute;
              left: 50%;
              top: 0;
            }

            .book-page {
              height: 4px;
              border-radius: 2px;
              transform-origin: 100% 2px;
              width: 48px;
              right: 0;
              top: -10px;
              position: absolute;
              background: var(--color);
              transform: rotateZ(0deg) translateX(-18px);
              animation-duration: var(--duration);
              animation-timing-function: ease;
              animation-iteration-count: infinite;
            }

            ${pages
              .map((i) => {
                const delay = i * 1.86;
                const delayAfter = i * 1.74;
                return `
              .book-page:nth-child(${i + 1}) {
                animation-name: page-${i};
              }
              
              @keyframes page-${i} {
                ${4 + delay}% {
                  transform: rotateZ(0deg) translateX(-18px);
                }
                ${13 + delayAfter}%,
                ${54 + delay}% {
                  transform: rotateZ(180deg) translateX(-18px);
                }
                ${63 + delayAfter}% {
                  transform: rotateZ(0deg) translateX(-18px);
                }
              }
            `;
              })
              .join("")}

            @keyframes left {
              4% {
                transform: rotateZ(90deg);
              }
              10%,
              40% {
                transform: rotateZ(0deg);
              }
              46%,
              54% {
                transform: rotateZ(90deg);
              }
              60%,
              90% {
                transform: rotateZ(0deg);
              }
              96% {
                transform: rotateZ(90deg);
              }
            }

            @keyframes right {
              4% {
                transform: rotateZ(-90deg);
              }
              10%,
              40% {
                transform: rotateZ(0deg);
              }
              46%,
              54% {
                transform: rotateZ(-90deg);
              }
              60%,
              90% {
                transform: rotateZ(0deg);
              }
              96% {
                transform: rotateZ(-90deg);
              }
            }

            @keyframes book {
              4% {
                transform: rotateZ(-90deg);
              }
              10%,
              40% {
                transform: rotateZ(0deg);
                transform-origin: 2px 2px;
              }
              40.01%,
              59.99% {
                transform-origin: 30px 2px;
              }
              46%,
              54% {
                transform: rotateZ(90deg);
              }
              60%,
              90% {
                transform: rotateZ(0deg);
                transform-origin: 2px 2px;
              }
              96% {
                transform: rotateZ(-90deg);
              }
            }
          `}</style>

          <div className="book-container relative w-8 h-3 mt-8">
            <div className="book-inner">
              <div className="book-left"></div>
              <div className="book-middle"></div>
              <div className="book-right"></div>
            </div>
            <ul className="book-pages">
              {pages.map((i) => (
                <li key={i} className="book-page"></li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <p className="text-primary-black text-base">Loading</p>
    </div>
  );
};

export default Loading;
