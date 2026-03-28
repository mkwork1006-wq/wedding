import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import hanatabaImage from "../assets/images/etc/hanataba.png";
import weddingTimelineImage from "../assets/images/etc/Wedding Timeline.png";

const topImages = Object.entries(
  import.meta.glob("../assets/images/top/TOP_*.*", {
    eager: true,
    import: "default"
  })
)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, src]) => src);

const initialHeroIndex = topImages.findIndex((src) => src.includes("TOP_A"));

const memoryImages = Object.entries(
  import.meta.glob("../assets/images/memory/*.{png,jpg,jpeg,webp,avif}", {
    eager: true,
    import: "default"
  })
)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: "base" }))
  .map(([, src]) => src);

const buttonImages = Object.entries(
  import.meta.glob("../assets/images/buttons/*.{png,jpg,jpeg,webp,avif}", {
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
const memoryLoopImages = [...memoryImages, ...memoryImages];
const swipeThreshold = 50;

function TopPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!heroSlides.length) {
      return 0;
    }
    return initialHeroIndex >= 0 ? initialHeroIndex : 0;
  });
  const [isPaused, setIsPaused] = useState(false);
  const [isMemoryPaused, setIsMemoryPaused] = useState(false);
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState(null);
  const [isTimelineModalOpen, setIsTimelineModalOpen] = useState(false);
  const touchStartXRef = useRef(null);
  const touchMoveXRef = useRef(null);
  const memoryTouchStartXRef = useRef(null);
  const memoryTouchMovedRef = useRef(false);
  const memoryResumeTimeoutRef = useRef(null);
  const totalSlides = heroSlides.length;
  const quickLinks = [
    {
      id: "seating",
      label: "席次表",
      image: buttonImages["zasekihyou_button2.jpg"] ?? buttonImages["zasakihyou_button.png"] ?? null
    },
    { id: "courses", label: "コース料理", image: buttonImages["cooking_button2.jpg"] ?? null },
    { id: "profile", label: "プロフィール", image: buttonImages["profile_button2.jpg"] ?? null },
    { id: "gallery", label: "ギャラリー", image: buttonImages["gallery_button2.jpg"] ?? null }
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

  const isLightboxOpen = selectedMemoryIndex !== null || isTimelineModalOpen;

  useEffect(() => {
    if (!isLightboxOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedMemoryIndex(null);
        setIsTimelineModalOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isLightboxOpen]);

  useEffect(() => {
    return () => {
      if (memoryResumeTimeoutRef.current !== null) {
        window.clearTimeout(memoryResumeTimeoutRef.current);
      }
    };
  }, []);

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

  const selectedMemoryImage = selectedMemoryIndex !== null ? memoryImages[selectedMemoryIndex] : null;

  const clearMemoryResumeTimeout = () => {
    if (memoryResumeTimeoutRef.current !== null) {
      window.clearTimeout(memoryResumeTimeoutRef.current);
      memoryResumeTimeoutRef.current = null;
    }
  };

  const pauseMemoryMarquee = () => {
    clearMemoryResumeTimeout();
    setIsMemoryPaused(true);
  };

  const resumeMemoryMarqueeLater = (delay = 1400) => {
    if (typeof window === "undefined") {
      return;
    }

    clearMemoryResumeTimeout();
    memoryResumeTimeoutRef.current = window.setTimeout(() => {
      setIsMemoryPaused(false);
      memoryResumeTimeoutRef.current = null;
    }, delay);
  };

  const handleMemoryTouchStart = (event) => {
    const startX = event.touches[0]?.clientX;
    memoryTouchStartXRef.current = startX ?? null;
    memoryTouchMovedRef.current = false;
    pauseMemoryMarquee();
  };

  const handleMemoryTouchMove = (event) => {
    const currentX = event.touches[0]?.clientX;
    if (memoryTouchStartXRef.current === null || currentX === undefined) {
      return;
    }

    if (Math.abs(currentX - memoryTouchStartXRef.current) > 8) {
      memoryTouchMovedRef.current = true;
    }
  };

  const handleMemoryTouchEnd = () => {
    memoryTouchStartXRef.current = null;
    resumeMemoryMarqueeLater();
  };

  const handleMemoryItemClick = (loopIndex) => {
    if (memoryTouchMovedRef.current) {
      memoryTouchMovedRef.current = false;
      return;
    }

    openMemoryModal(loopIndex);
  };

  const openMemoryModal = (loopIndex) => {
    if (!memoryImages.length) {
      return;
    }
    setSelectedMemoryIndex(loopIndex % memoryImages.length);
  };

  const closeMemoryModal = () => {
    setSelectedMemoryIndex(null);
  };

  const openTimelineModal = () => {
    setIsTimelineModalOpen(true);
  };

  const closeTimelineModal = () => {
    setIsTimelineModalOpen(false);
  };

  const memoryModal = selectedMemoryImage
    ? createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-white/90 px-4 py-8 backdrop-blur-sm"
          onClick={closeMemoryModal}
          role="dialog"
          aria-modal="true"
          aria-label="思い出の写真の拡大表示"
        >
          <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeMemoryModal}
              className="mb-3 text-3xl leading-none text-[#7c6988] transition hover:text-[#5f4f69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b59bc7]"
              aria-label="拡大画像を閉じる"
            >
              ×
            </button>
            <img
              src={selectedMemoryImage}
              alt={`思い出の写真 ${selectedMemoryIndex + 1}（拡大）`}
              className="max-h-[82vh] w-full bg-white object-contain"
              decoding="async"
            />
          </div>
        </div>,
        document.body
      )
    : null;

  const timelineModal = isTimelineModalOpen
    ? createPortal(
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-white/90 px-4 py-8 backdrop-blur-sm"
          onClick={closeTimelineModal}
          role="dialog"
          aria-modal="true"
          aria-label="結婚式当日のタイムラインの拡大表示"
        >
          <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={closeTimelineModal}
              className="mb-3 text-3xl leading-none text-[#7c6988] transition hover:text-[#5f4f69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b59bc7]"
              aria-label="タイムラインの拡大画像を閉じる"
            >
              ×
            </button>
            <img
              src={weddingTimelineImage}
              alt="結婚式当日のタイムライン（拡大）"
              className="max-h-[82vh] w-full bg-white object-contain"
              decoding="async"
            />
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <section className="space-y-7 md:space-y-8" id="hero">
      <div
        className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden p-0"
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
                loading={index === activeIndex ? "eager" : "lazy"}
                fetchPriority={index === activeIndex ? "high" : "low"}
                decoding="async"
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
      </div>
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
        {memoryImages.length ? (
          <section aria-label="思い出の写真" className="mb-7 space-y-4 md:mb-9">
            <h2 className="relative -left-[30px] px-4 font-['Playfair_Display'] text-[45px] font-semibold leading-none tracking-[0.01em] text-[color:var(--ink)] sm:px-6">
              Memory
            </h2>
            <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
              <div
                className="overflow-x-auto overflow-y-hidden px-4 py-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden sm:px-6"
                style={{ WebkitOverflowScrolling: "touch" }}
                onMouseEnter={pauseMemoryMarquee}
                onMouseLeave={() => setIsMemoryPaused(false)}
                onTouchStart={handleMemoryTouchStart}
                onTouchMove={handleMemoryTouchMove}
                onTouchEnd={handleMemoryTouchEnd}
                onTouchCancel={handleMemoryTouchEnd}
                onScroll={() => {
                  pauseMemoryMarquee();
                  resumeMemoryMarqueeLater();
                }}
              >
                <div
                  className={`flex w-max gap-4 py-1 ${memoryImages.length > 1 ? "animate-memory-marquee" : ""}`}
                  style={{
                    animationDuration: "36s",
                    animationPlayState: isMemoryPaused || isLightboxOpen ? "paused" : "running"
                  }}
                >
                  {memoryLoopImages.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => handleMemoryItemClick(index)}
                      className="shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
                      aria-label={`思い出の写真 ${(index % memoryImages.length) + 1} を拡大表示`}
                    >
                      <img
                        src={image}
                        alt={`思い出の写真 ${(index % memoryImages.length) + 1}`}
                        className="h-[220px] w-auto max-w-none object-cover"
                        loading={index < memoryImages.length ? "eager" : "lazy"}
                        fetchPriority="low"
                        decoding="async"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}
        <div className="relative border border-[#ececec] bg-[#f3f3f3] px-4 pb-6 pt-5 text-center sm:px-8 sm:pb-8 sm:pt-6">
          <p className="mt-2 font-['Playfair_Display'] text-[46px] font-semibold leading-none tracking-[0.01em] text-[color:var(--ink)] sm:text-[61px]">
            2026.03.29
          </p>
          <p className="mx-auto mt-6 max-w-4xl text-[15px] font-medium leading-8 text-[color:var(--muted)] sm:text-base">
            本日はお忙しい中、私たちの結婚式にお越しいただきありがとうございます。<br />このサイトでは席次表、コース料理、プロフィール、ギャラリーを掲載してます。<br />ぜひご活用ください！
          </p>
          <img
            src={hanatabaImage}
            alt="花束の装飾"
            className="pointer-events-none absolute -bottom-[24px] right-[-22px] z-20 w-[72px] sm:-bottom-[40px] sm:right-[-18px] sm:w-[90px]"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
      <section className="mx-auto w-full max-w-5xl space-y-4 px-4 pb-4 pt-12 sm:px-6">
        <h2 className="relative -left-[30px] font-['Playfair_Display'] text-[45px] font-semibold leading-none tracking-[0.01em] text-[color:var(--ink)]">
          Schedule
        </h2>
        <button
          type="button"
          onClick={openTimelineModal}
          className="block w-full transition hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] focus-visible:ring-offset-2"
          aria-label="結婚式当日のタイムラインを拡大表示"
        >
          <img
            src={weddingTimelineImage}
            alt="結婚式当日のタイムライン"
            className="w-full bg-white object-contain"
            loading="lazy"
            fetchPriority="low"
            decoding="async"
          />
        </button>
      </section>
      <section className="mx-auto !mt-[50px] w-full max-w-3xl space-y-4 px-4 sm:px-6">
        <h2 className="relative -left-[30px] font-['Playfair_Display'] text-[45px] font-semibold leading-none tracking-[0.01em] text-[color:var(--ink)]">
          Menu
        </h2>
        <div className="grid w-full grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-4">
          {quickLinks.map(({ id, label, image }) => (
            <div key={id} className="flex flex-col items-center gap-2">
              <button
                type="button"
                onClick={() => onNavigate?.(id)}
                className="group w-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                aria-label={`${label}へ`}
              >
                <div className="aspect-[4/5] overflow-hidden rounded-none bg-[#fafafa] shadow-sm transition group-hover:-translate-y-0.5">
                  {image ? (
                    <img
                      src={image}
                      alt={`${label}のイメージ`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      fetchPriority="low"
                      decoding="async"
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
                className="text-sm font-semibold text-[color:var(--ink)] transition hover:text-[color:var(--ink)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
                aria-label={`${label}へ`}
              >
                {label}
              </button>
            </div>
          ))}
        </div>
      </section>
      {memoryModal}
      {timelineModal}
    </section>
  );
}

export default TopPage;
