import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SectionShell } from "../components/ui";

const collectImages = (modules) =>
  Object.entries(modules)
    .sort(([pathA], [pathB]) => pathA.localeCompare(pathB, undefined, { numeric: true, sensitivity: "base" }))
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
const MIN_ZOOM_SCALE = 1;
const MAX_ZOOM_SCALE = 4;

const createBatch = (tabKey, images, startIndex, count, reveal) =>
  images.slice(startIndex, startIndex + count).map((src, index) => {
    const position = startIndex + index;
    return {
      id: `${tabKey}-${position}`,
      src,
      reveal
    };
  });

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const getTouchDistance = (touches) => {
  if (touches.length < 2) {
    return 0;
  }
  const [firstTouch, secondTouch] = touches;
  return Math.hypot(secondTouch.clientX - firstTouch.clientX, secondTouch.clientY - firstTouch.clientY);
};

const initialGesture = {
  mode: null,
  startDistance: 0,
  startScale: MIN_ZOOM_SCALE,
  startOffsetX: 0,
  startOffsetY: 0,
  startX: 0,
  startY: 0
};

function GalleryPage() {
  const [activeTab, setActiveTab] = useState("groom");
  const [items, setItems] = useState(() =>
    groomSources.length ? createBatch("groom", groomSources, 0, IMAGE_BATCH, false) : []
  );
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [slideMotion, setSlideMotion] = useState(null);
  const [zoomState, setZoomState] = useState({ scale: MIN_ZOOM_SCALE, offsetX: 0, offsetY: 0 });
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const touchStartXRef = useRef(null);
  const touchStartYRef = useRef(null);
  const gestureRef = useRef(initialGesture);
  const activeImageRef = useRef(null);

  const activeImages = activeTab === "groom" ? groomSources : brideSources;
  const activeLabel = activeTab === "groom" ? "groom" : "bride";
  const hasSelection = selectedIndex !== null;
  const selectedImage = hasSelection ? activeImages[selectedIndex] : null;
  const isSliding = slideMotion !== null;
  const canShowPrev = selectedIndex !== null && selectedIndex > 0;
  const canShowNext = selectedIndex !== null && selectedIndex < activeImages.length - 1;

  const clampOffsets = useCallback((offsetX, offsetY, scale) => {
    const imageElement = activeImageRef.current;

    if (!imageElement || scale <= MIN_ZOOM_SCALE) {
      return { offsetX: 0, offsetY: 0 };
    }

    const { clientWidth, clientHeight } = imageElement;
    const maxOffsetX = Math.max((clientWidth * scale - clientWidth) / 2, 0);
    const maxOffsetY = Math.max((clientHeight * scale - clientHeight) / 2, 0);

    return {
      offsetX: clamp(offsetX, -maxOffsetX, maxOffsetX),
      offsetY: clamp(offsetY, -maxOffsetY, maxOffsetY)
    };
  }, []);

  const resetZoom = useCallback(() => {
    gestureRef.current = initialGesture;
    setZoomState((prev) =>
      prev.scale === MIN_ZOOM_SCALE && prev.offsetX === 0 && prev.offsetY === 0
        ? prev
        : { scale: MIN_ZOOM_SCALE, offsetX: 0, offsetY: 0 }
    );
  }, []);

  useEffect(() => {
    const images = activeTab === "groom" ? groomSources : brideSources;
    setSelectedIndex(null);
    setSlideMotion(null);
    loadingRef.current = false;
    resetZoom();

    if (!images.length) {
      setItems([]);
      return;
    }

    setItems(createBatch(activeTab, images, 0, Math.min(IMAGE_BATCH, images.length), false));

    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [activeTab, resetZoom]);

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
        if (items.length >= activeImages.length) {
          return;
        }
        loadingRef.current = true;
        setItems((prev) => [
          ...prev,
          ...createBatch(activeTab, activeImages, prev.length, IMAGE_BATCH, true)
        ]);
      },
      { rootMargin: "240px 0px" }
    );

    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [activeImages, activeTab, items.length]);

  useEffect(() => {
    loadingRef.current = false;
  }, [items.length, activeTab]);

  const closeModal = useCallback(() => {
    setSlideMotion(null);
    setSelectedIndex(null);
    resetZoom();
  }, [resetZoom]);

  const startSlide = useCallback(
    (direction) => {
      if (!activeImages.length || selectedIndex === null || isSliding) {
        return;
      }

      const delta = direction === "next" ? 1 : -1;
      const nextIndex = selectedIndex + delta;
      if (nextIndex < 0 || nextIndex >= activeImages.length) {
        return;
      }

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
    resetZoom();
  }, [resetZoom, selectedIndex]);

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
    if (isSliding) {
      return;
    }

    if (event.touches.length >= 2) {
      gestureRef.current = {
        mode: "pinch",
        startDistance: getTouchDistance(event.touches),
        startScale: zoomState.scale,
        startOffsetX: zoomState.offsetX,
        startOffsetY: zoomState.offsetY,
        startX: 0,
        startY: 0
      };
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    const startX = event.touches[0]?.clientX ?? null;
    const startY = event.touches[0]?.clientY ?? null;

    if (startX === null || startY === null) {
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    if (zoomState.scale > MIN_ZOOM_SCALE) {
      gestureRef.current = {
        mode: "pan",
        startDistance: 0,
        startScale: zoomState.scale,
        startOffsetX: zoomState.offsetX,
        startOffsetY: zoomState.offsetY,
        startX,
        startY
      };
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
    if (gestureRef.current.mode === "pinch" && event.touches.length >= 2) {
      if (event.cancelable) {
        event.preventDefault();
      }

      const distance = getTouchDistance(event.touches);
      if (!distance || !gestureRef.current.startDistance) {
        return;
      }

      const nextScale = clamp(
        (distance / gestureRef.current.startDistance) * gestureRef.current.startScale,
        MIN_ZOOM_SCALE,
        MAX_ZOOM_SCALE
      );
      const clampedOffsets = clampOffsets(
        gestureRef.current.startOffsetX,
        gestureRef.current.startOffsetY,
        nextScale
      );

      setZoomState((prev) =>
        prev.scale === nextScale &&
        prev.offsetX === clampedOffsets.offsetX &&
        prev.offsetY === clampedOffsets.offsetY
          ? prev
          : { scale: nextScale, ...clampedOffsets }
      );
      return;
    }

    if (gestureRef.current.mode === "pan" && event.touches.length === 1) {
      if (event.cancelable) {
        event.preventDefault();
      }

      const currentX = event.touches[0]?.clientX ?? gestureRef.current.startX;
      const currentY = event.touches[0]?.clientY ?? gestureRef.current.startY;
      const nextOffsetX = gestureRef.current.startOffsetX + (currentX - gestureRef.current.startX);
      const nextOffsetY = gestureRef.current.startOffsetY + (currentY - gestureRef.current.startY);
      const clampedOffsets = clampOffsets(nextOffsetX, nextOffsetY, zoomState.scale);

      setZoomState((prev) =>
        prev.offsetX === clampedOffsets.offsetX && prev.offsetY === clampedOffsets.offsetY
          ? prev
          : { ...prev, ...clampedOffsets }
      );
      return;
    }

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
    if (gestureRef.current.mode === "pinch") {
      if (event.touches.length === 1 && zoomState.scale > MIN_ZOOM_SCALE) {
        const remainingTouch = event.touches[0];
        gestureRef.current = {
          mode: "pan",
          startDistance: 0,
          startScale: zoomState.scale,
          startOffsetX: zoomState.offsetX,
          startOffsetY: zoomState.offsetY,
          startX: remainingTouch.clientX,
          startY: remainingTouch.clientY
        };
        return;
      }

      gestureRef.current = initialGesture;
      if (zoomState.scale <= MIN_ZOOM_SCALE + 0.01) {
        resetZoom();
      }
      return;
    }

    if (gestureRef.current.mode === "pan") {
      gestureRef.current = initialGesture;
      if (zoomState.scale <= MIN_ZOOM_SCALE + 0.01) {
        resetZoom();
      }
      return;
    }

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

  const handleTouchCancel = () => {
    touchStartXRef.current = null;
    touchStartYRef.current = null;
    gestureRef.current = initialGesture;
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
                className="relative flex w-full max-w-5xl flex-col items-center justify-center [touch-action:none]"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchCancel}
              >
                <div className="relative h-[82vh] w-full overflow-hidden">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="absolute right-4 top-4 z-20 text-[2rem] leading-none text-white/85 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
                    aria-label="閉じる"
                  >
                    ×
                  </button>

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
                          decoding="async"
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
                          decoding="async"
                        />
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img
                        ref={activeImageRef}
                        src={selectedImage}
                        alt={`${activeLabel}ギャラリー ${selectedIndex + 1}`}
                        className="max-h-full max-w-full rounded-md object-contain shadow-[0_20px_60px_rgba(0,0,0,0.5)] select-none transition-transform duration-150 ease-out"
                        draggable="false"
                        decoding="async"
                        style={{
                          transform: `translate3d(${zoomState.offsetX}px, ${zoomState.offsetY}px, 0) scale(${zoomState.scale})`
                        }}
                      />
                    </div>
                  )}

                  {activeImages.length > 1 ? (
                    <div className="absolute inset-x-0 bottom-4 z-20 flex items-center justify-center gap-12">
                      <button
                        type="button"
                        onClick={showPrev}
                        disabled={!canShowPrev}
                        className={`text-[2.15rem] leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                          canShowPrev ? "text-white/85 hover:text-white" : "cursor-default text-white/25"
                        }`}
                        aria-label="前の写真"
                      >
                        ‹
                      </button>
                      <button
                        type="button"
                        onClick={showNext}
                        disabled={!canShowNext}
                        className={`text-[2.15rem] leading-none transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 ${
                          canShowNext ? "text-white/85 hover:text-white" : "cursor-default text-white/25"
                        }`}
                        aria-label="次の写真"
                      >
                        ›
                      </button>
                    </div>
                  ) : null}
                </div>
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
        <div className="text-center">
          <div className="inline-flex items-center gap-3 font-['Playfair_Display'] text-[2rem] font-semibold leading-none tracking-[0.01em] text-[color:var(--ink)] md:text-[2.2rem]">
            <button
              type="button"
              onClick={() => setActiveTab("groom")}
              aria-pressed={activeTab === "groom"}
              className={`transition duration-200 ${
                activeTab === "groom" ? "opacity-100" : "opacity-45 hover:opacity-70"
              }`}
            >
              groom
            </button>
            <span className="text-[1.6rem] opacity-70">/</span>
            <button
              type="button"
              onClick={() => setActiveTab("bride")}
              aria-pressed={activeTab === "bride"}
              className={`transition duration-200 ${
                activeTab === "bride" ? "opacity-100" : "opacity-45 hover:opacity-70"
              }`}
            >
              bride
            </button>
          </div>
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
                  setSelectedIndex(index);
                }}
                className={`group relative aspect-square w-full overflow-hidden rounded-[14px] border border-[#f0efed] bg-[#fafafa] shadow-sm transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] ${
                  item.reveal ? "animate-gallery-reveal" : ""
                }`}
              >
                <img
                  src={item.src}
                  alt={`${activeLabel}ギャラリー ${index + 1}`}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                  fetchPriority="low"
                  decoding="async"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />
              </button>
            ))}
          </div>
          <div ref={sentinelRef} className="h-10" aria-hidden="true" />
        </>
      ) : (
        <div className="rounded-[14px] border border-[#efeded] bg-[#fafafa] px-6 py-10 text-sm text-[color:var(--muted)]">
          ただいま写真を準備中です。しばらくお待ちください。
        </div>
      )}

      {typeof window !== "undefined" ? fullscreenModal : null}
    </SectionShell>
  );
}

export default GalleryPage;
