import { useEffect, useRef, useState } from "react";
import { SurfaceCard } from "../components/ui";

const topImages = Object.entries(
  import.meta.glob("../assets/images/top/TOP_*.*", {
    eager: true,
    import: "default"
  })
)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, src]) => src);

const buttonImages = Object.entries(
  import.meta.glob("../assets/images/buttons/*.png", {
    eager: true,
    import: "default"
  })
).reduce((accumulator, [path, src]) => {
  const filename = path.split("/").pop();
  if (filename) {
    accumulator[filename] = src;
  }
  return accumulator;
}, {});

const heroSlides = topImages;
const swipeThreshold = 50;

function TopPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!heroSlides.length) {
      return 0;
    }
    return Math.floor(Math.random() * heroSlides.length);
  });
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef(null);
  const touchMoveXRef = useRef(null);
  const totalSlides = heroSlides.length;
  const quickLinks = [
    { id: "seating", label: "席次表", image: buttonImages["zasakihyou_button.png"] ?? null },
    { id: "courses", label: "コース料理", image: buttonImages["cooking_button.png"] ?? null },
    { id: "profile", label: "プロフィール", image: buttonImages["profile_button.png"] ?? null },
    { id: "gallery", label: "ギャラリー", image: buttonImages["gallery_button.png"] ?? null }
  ];

  useEffect(() => {
    if (totalSlides <= 1 || isPaused) {
      return undefined;
    }
    const timer = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }, 6500);
    return () => window.clearTimeout(timer);
  }, [activeIndex, isPaused, totalSlides]);

  const moveSlideBy = (direction) => {
    if (totalSlides <= 1) {
      return;
    }
    setActiveIndex((prev) => (prev + direction + totalSlides) % totalSlides);
  };

  const handleTouchStart = (event) => {
    if (totalSlides <= 1) {
      return;
    }
    const firstTouch = event.touches[0];
    if (!firstTouch) {
      return;
    }
    touchStartXRef.current = firstTouch.clientX;
    touchMoveXRef.current = firstTouch.clientX;
    setIsPaused(true);
  };

  const handleTouchMove = (event) => {
    const firstTouch = event.touches[0];
    if (!firstTouch) {
      return;
    }
    touchMoveXRef.current = firstTouch.clientX;
  };

  const finalizeTouch = () => {
    const startX = touchStartXRef.current;
    const endX = touchMoveXRef.current;
    touchStartXRef.current = null;
    touchMoveXRef.current = null;
    setIsPaused(false);
    if (startX === null || endX === null) {
      return;
    }
    const deltaX = endX - startX;
    if (Math.abs(deltaX) < swipeThreshold) {
      return;
    }
    moveSlideBy(deltaX < 0 ? 1 : -1);
  };

  return (
    <section className="space-y-7 md:space-y-8" id="hero">
      <SurfaceCard
        tone="plain"
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden rounded-none !border-0 p-0 !shadow-none"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onFocusCapture={() => setIsPaused(true)}
        onBlurCapture={() => setIsPaused(false)}
      >
        {totalSlides ? (
          <div
            className="relative h-[570px] w-full touch-pan-y md:h-[670px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="トップビジュアルのカルーセル"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={finalizeTouch}
            onTouchCancel={finalizeTouch}
          >
            {heroSlides.map((slide, index) => (
              <img
                key={`${slide}-${index}`}
                src={slide}
                alt={`トップビジュアル ${index + 1}`}
                className={`absolute inset-0 h-full w-full object-cover object-top transition-opacity duration-1000 ${
                  index === activeIndex ? "opacity-100" : "opacity-0"
                }`}
                aria-hidden={index !== activeIndex}
              />
            ))}
            <div className="pointer-events-none absolute left-6 top-1/2 z-20 -translate-y-1/2 md:left-10">
              <p className="origin-center rotate-180 font-['Noto_Sans_JP'] text-[34px] font-semibold leading-none tracking-[0.04em] text-[color:var(--ink)] [writing-mode:vertical-rl] [text-orientation:mixed]">
                Welcome to our Wedding
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[570px] w-full bg-[#f2f4f8] md:h-[670px]" />
        )}
      </SurfaceCard>
      <div className="mx-auto w-full px-2 sm:px-3">
        {totalSlides > 1 ? (
          <div className="relative z-20 mb-4 flex items-center justify-center gap-3">
            {heroSlides.map((slide, index) => (
              <button
                key={`${slide}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === activeIndex ? "bg-[color:var(--ink)]" : "bg-[#d6d8e0] md:hover:bg-[color:var(--ink)]"
                }`}
                aria-label={`スライド ${index + 1}へ`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        ) : null}
        <div className="border border-[#ececec] bg-[#f3f3f3] px-4 pb-6 pt-5 text-center sm:px-8 sm:pb-8 sm:pt-6">
          <p className="mt-2 font-['Cormorant_Garamond'] text-[58px] font-semibold italic leading-none tracking-[0.01em] text-[color:var(--ink)] sm:text-[76px]">
            2026.03.29
          </p>
          <p className="mx-auto mt-6 max-w-4xl text-[15px] font-medium leading-8 text-[color:var(--muted)] sm:text-base">
            本日はお忙しい中、私たちの結婚式にお越しいただきありがとうございます。<br />このサイトでは席次表、コース料理、プロフィール、ギャラリーを掲載しております。ぜひご活用ください！
          </p>
        </div>
      </div>
      <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
        {quickLinks.map(({ id, label, image }) => (
          <div key={id} className="flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate?.(id)}
              className="group w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              aria-label={`${label}へ`}
            >
              <div className="aspect-square overflow-hidden rounded-2xl bg-[#fafafa] shadow-sm transition group-hover:-translate-y-0.5">
                {image ? (
                  <img
                    src={image}
                    alt={`${label}のイメージ`}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#f4f5f8]">
                    <span className="text-xs font-medium text-[color:var(--subtle)]">画像準備中</span>
                  </div>
                )}
              </div>
            </button>
            <button
              type="button"
              onClick={() => onNavigate?.(id)}
              className="text-sm font-semibold text-[color:var(--ink)] underline decoration-[1.5px] underline-offset-4 transition hover:text-[color:var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              aria-label={`${label}へ`}
            >
              {label}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default TopPage;
