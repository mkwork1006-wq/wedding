import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SectionShell } from "../components/ui";

const collectImages = (modules) =>
  Object.entries(modules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
    .map(([, source]) => source);

const groomSources = collectImages(
  import.meta.glob("../assets/images/shinrou/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
    eager: true,
    import: "default"
  })
);
const brideSources = collectImages(
  import.meta.glob("../assets/images/shinpu/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
    eager: true,
    import: "default"
  })
);

const IMAGE_BATCH = 12;
const SWIPE_THRESHOLD = 56;
const SLIDE_DURATION_MS = 360;
const EDGE_GUARD_PX = 24;

const createBatch = (tabKey, images, startIndex, count, reveal) =>
  Array.from({ length: count }, (_, index) => {
    const position = startIndex + index;
    const src = images[position % images.length];
    return {
      id: `${tabKey}-${position}`,
      src,
      reveal
    };
  });

function GalleryPage() {
  const [activeTab, setActiveTab] = useState("groom");
  const [items, setItems] = useState(() =>
    groomSources.length ? createBatch("groom", groomSources, 0, IMAGE_BATCH, false) : []
  );
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [slideMotion, setSlideMotion] = useState(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);

  const activeImages = activeTab === "groom" ? groomSources : brideSources;
  const activeLabel = activeTab === "groom" ? "groom" : "bride";
  const hasSelection = selectedIndex !== null;
  const selectedImage = hasSelection ? activeImages[selectedIndex] : null;
  const isSliding = slideMotion !== null;

  useEffect(() => {
    const images = activeTab === "groom" ? groomSources : brideSources;
    setSelectedIndex(null);
    setSlideMotion(null);
    loadingRef.current = false;

    if (!images.length) {
      setItems([]);
      return;
    }

    setItems(createBatch(activeTab, images, 0, IMAGE_BATCH, false));

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab]);

  useEffect(() => {
    if (!sentinelRef.current) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting) {
          return;
        }
        if (loadingRef.current || !activeImages.length) {
          return;
        }
        loadingRef.current = true;
        setItems((prev) => [...prev, ...createBatch(activeTab, activeImages, prev.length, IMAGE_BATCH, true)]);
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [activeImages, activeTab]);

  useEffect(() => {
    loadingRef.current = false;
  }, [items.length, activeTab]);

  const closeModal = useCallback(() => {
    setSlideMotion(null);
    setSelectedIndex(null);
  }, []);

  const startSlide = useCallback(
    (direction) => {
      if (!activeImages.length || selectedIndex === null || isSliding) {
        return;
      }

      const delta = direction === "next" ? 1 : -1;
      const nextIndex = (selectedIndex + delta + activeImages.length) % activeImages.length;

      setSlideMotion({
        from: selectedIndex,
        to: nextIndex,
        direction,
        phase: "enter"
      });

      const run = () => {
        setSlideMotion((prev) => (prev ? { ...prev, phase: "active" } : prev));
      };

      if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(() => window.requestAnimationFrame(run));
        return;
      }
      setTimeout(run, 0);
    },
    [activeImages.length, isSliding, selectedIndex]
  );

  const showPrev = useCallback(() => {
    startSlide("prev");
  }, [startSlide]);

  const showNext = useCallback(() => {
    startSlide("next");
  }, [startSlide]);

  useEffect(() => {
    if (!slideMotion || slideMotion.phase !== "active") {
      return undefined;
    }

    const timer = setTimeout(() => {
      setSelectedIndex(slideMotion.to);
      setSlideMotion(null);
    }, SLIDE_DURATION_MS);

    return () => {
      clearTimeout(timer);
    };
  }, [slideMotion]);

  useEffect(() => {
    if (!hasSelection) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
      if (event.key === "ArrowLeft") {
        showPrev();
      }
      if (event.key === "ArrowRight") {
        showNext();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    const previousOverscrollBehavior = document.body.style.overscrollBehavior;
    const previousOverscrollBehaviorX = document.body.style.overscrollBehaviorX;
    document.body.style.overflow = "hidden";
    document.body.style.overscrollBehavior = "none";
    document.body.style.overscrollBehaviorX = "none";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      document.body.style.overscrollBehavior = previousOverscrollBehavior;
      document.body.style.overscrollBehaviorX = previousOverscrollBehaviorX;
    };
  }, [closeModal, hasSelection, showNext, showPrev]);

  const handleTouchStart = (event) => {
    const startX = event.touches[0]?.clientX ?? null;
    const startY = event.touches[0]?.clientY ?? null;

    if (startX === null || startY === null) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    if (typeof window !== "undefined") {
      const width = window.innerWidth;
      // 画面端からのジェスチャーはブラウザナビゲーションと競合しやすいため除外
      if (startX <= EDGE_GUARD_PX || startX >= width - EDGE_GUARD_PX) {
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        return;
      }
    }

    touchStartXRef.current = startX;
    touchStartYRef.current = startY;
  };

  const handleTouchMove = (event) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) {
      return;
    }

    const currentX = event.touches[0]?.clientX ?? touchStartXRef.current;
    const currentY = event.touches[0]?.clientY ?? touchStartYRef.current;
    const deltaX = currentX - touchStartXRef.current;
    const deltaY = currentY - touchStartYRef.current;

    // モーダル表示中の横スワイプでブラウザの「戻る」ジェスチャーが出るのを抑制
    if (Math.abs(deltaX) > Math.abs(deltaY) && event.cancelable) {
      event.preventDefault();
    }
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) {
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return;
    }
    if (deltaX > 0) {
      showPrev();
      return;
    }
    showNext();
  };

  const outgoingImage = slideMotion ? activeImages[slideMotion.from] : null;
  const incomingImage = slideMotion ? activeImages[slideMotion.to] : null;
  const incomingStartX = slideMotion?.direction === "next" ? "100%" : "-100%";
  const outgoingEndX = slideMotion?.direction === "next" ? "-100%" : "100%";

  const fullscreenModal =
    hasSelection && selectedImage
      ? createPortal(
          <div
            className="fixed inset-0 z-[120] bg-black/95"
            onClick={closeModal}
            role="dialog"
            aria-modal="true"
            aria-label="全画面画像"
          >
            <div
              className="relative flex h-full w-full items-center justify-center px-4 py-14 sm:px-8"
              onClick={(event) => event.stopPropagation()}
            >
              <div
                className="relative flex w-full max-w-5xl flex-col items-center justify-center gap-4 [touch-action:pan-y]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute -top-12 right-1 z-10 text-[2rem] leading-none text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                  aria-label="閉じる"
                >
                  ×
                </button>

                <div className="relative h-[82vh] w-full overflow-hidden">
                  {slideMotion && outgoingImage && incomingImage ? (
                    <>
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform:
                            slideMotion.phase === "active" ? `translateX(${outgoingEndX})` : "translateX(0%)",
                          transition: `transform ${SLIDE_DURATION_MS}ms ease`
                        }}
                      >
                        <img
                          src={outgoingImage}
                          alt={`${activeLabel}ギャラリー ${slideMotion.from + 1}`}
                          className="max-h-full max-w-full rounded-md object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] select-none"
                          draggable="false"
                        />
                      </div>
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transform:
                            slideMotion.phase === "active"
                              ? "translateX(0%)"
                              : `translateX(${incomingStartX})`,
                          transition: `transform ${SLIDE_DURATION_MS}ms ease`
                        }}
                      >
                        <img
                          src={incomingImage}
                          alt={`${activeLabel}ギャラリー ${slideMotion.to + 1}`}
                          className="max-h-full max-w-full rounded-md object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] select-none"
                          draggable="false"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        src={selectedImage}
                        alt={`${activeLabel}ギャラリー ${selectedIndex + 1}`}
                        className="max-h-full max-w-full rounded-md object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] select-none"
                        draggable="false"
                      />
                    </div>
                  )}
                </div>

                {activeImages.length > 1 ? (
                  <div className="flex items-center justify-center gap-12 pb-1">
                    <button
                      type="button"
                      onClick={showPrev}
                      className="text-[2.15rem] leading-none text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                      aria-label="前の写真"
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={showNext}
                      className="text-[2.15rem] leading-none text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                      aria-label="次の写真"
                    >
                      ›
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <SectionShell id="gallery">
      <div className="space-y-4">
        <p className="text-center text-[10px] tracking-[0.34em] text-[color:var(--subtle)]">✦ GALLERY</p>
        <div className="mx-auto grid w-full max-w-[24rem] grid-cols-2 gap-5 px-1 text-center">
          <button
            type="button"
            onClick={() => setActiveTab("groom")}
            className={`group relative pb-3 font-['Cormorant_Garamond'] text-[clamp(1.95rem,6vw,2.45rem)] font-semibold italic leading-none tracking-[0.04em] transition-colors duration-300 ${
              activeTab === "groom"
                ? "text-[#b59bc7]"
                : "text-[#ababab] hover:text-[#8f8f8f]"
            }`}
          >
            groom
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-all duration-300 ${
                activeTab === "groom"
                  ? "w-[74%] bg-gradient-to-r from-[#cfbfdd] via-[#b59bc7] to-[#cfbfdd] opacity-100"
                  : "w-[56%] bg-[#b6b6b6] opacity-75 group-hover:opacity-90"
              }`}
            />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bride")}
            className={`group relative pb-3 font-['Cormorant_Garamond'] text-[clamp(1.95rem,6vw,2.45rem)] font-semibold italic leading-none tracking-[0.04em] transition-colors duration-300 ${
              activeTab === "bride"
                ? "text-[#b59bc7]"
                : "text-[#ababab] hover:text-[#8f8f8f]"
            }`}
          >
            bride
            <span
              aria-hidden="true"
              className={`absolute bottom-0 left-1/2 h-[2px] -translate-x-1/2 rounded-full transition-all duration-300 ${
                activeTab === "bride"
                  ? "w-[74%] bg-gradient-to-r from-[#cfbfdd] via-[#b59bc7] to-[#cfbfdd] opacity-100"
                  : "w-[56%] bg-[#b6b6b6] opacity-75 group-hover:opacity-90"
              }`}
            />
          </button>
        </div>
      </div>

      {activeImages.length ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSlideMotion(null);
                  setSelectedIndex(index % activeImages.length);
                }}
                className={`group relative aspect-square w-full overflow-hidden rounded-2xl border border-[#f0efed] bg-[#fafafa] shadow-sm transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] ${
                  item.reveal ? "animate-gallery-reveal" : ""
                }`}
              >
                <img
                  src={item.src}
                  alt={`${activeLabel}ギャラリー ${index + 1}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" aria-hidden="true" />
        </>
      ) : (
        <div className="rounded-2xl border border-[#efeded] bg-[#fafafa] px-6 py-10 text-sm text-[color:var(--muted)]">
          ただいま写真を準備中です。しばらくお待ちください。
        </div>
      )}

      {typeof window !== "undefined" ? fullscreenModal : null}
    </SectionShell>
  );
}

export default GalleryPage;
