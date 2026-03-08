import { useCallback, useEffect, useRef, useState } from "react";
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
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);
  const touchStartXRef = useRef(null);

  const activeImages = activeTab === "groom" ? groomSources : brideSources;
  const activeLabel = activeTab === "groom" ? "新郎" : "新婦";
  const hasSelection = selectedIndex !== null;
  const selectedImage = hasSelection ? activeImages[selectedIndex] : null;

  useEffect(() => {
    const images = activeTab === "groom" ? groomSources : brideSources;
    setSelectedIndex(null);
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

  const showPrev = useCallback(() => {
    if (!activeImages.length) {
      return;
    }
    setSelectedIndex((prev) => {
      if (prev === null) {
        return 0;
      }
      return (prev - 1 + activeImages.length) % activeImages.length;
    });
  }, [activeImages.length]);

  const showNext = useCallback(() => {
    if (!activeImages.length) {
      return;
    }
    setSelectedIndex((prev) => {
      if (prev === null) {
        return 0;
      }
      return (prev + 1) % activeImages.length;
    });
  }, [activeImages.length]);

  useEffect(() => {
    if (!hasSelection) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelectedIndex(null);
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
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [hasSelection, showNext, showPrev]);

  const handleTouchStart = (event) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartXRef.current === null) {
      return;
    }
    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaX = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(deltaX) < SWIPE_THRESHOLD) {
      return;
    }
    if (deltaX > 0) {
      showPrev();
      return;
    }
    showNext();
  };

  return (
    <SectionShell
      id="gallery"
      eyebrow="ギャラリー"
      title="ギャラリー"
      description="正方形のフレームに、ふたりの空気感を等間隔で並べました。タブで切り替え、タップで全画面表示できます。"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex rounded-full border border-[#e9e6e3] bg-white p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setActiveTab("groom")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "groom"
                ? "bg-[#f7f0ff] text-[color:var(--ink)] shadow-sm"
                : "text-[color:var(--ink)] hover:text-[color:var(--ink)]"
            }`}
          >
            新郎
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bride")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              activeTab === "bride"
                ? "bg-[#f7f0ff] text-[color:var(--ink)] shadow-sm"
                : "text-[color:var(--ink)] hover:text-[color:var(--ink)]"
            }`}
          >
            新婦
          </button>
        </div>
        <p className="text-xs text-[color:var(--subtle)]">スクロールで写真が続きます</p>
      </div>

      {activeImages.length ? (
        <>
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedIndex(index % activeImages.length)}
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

      {hasSelection && selectedImage ? (
        <div
          className="fixed inset-0 z-50 bg-white"
          onClick={() => setSelectedIndex(null)}
          role="dialog"
          aria-modal="true"
          aria-label="全画面画像"
        >
          <div
            className="relative flex h-full w-full items-center justify-center px-3 py-16 sm:px-8"
            onClick={(event) => event.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <button
              type="button"
              onClick={() => setSelectedIndex(null)}
              className="absolute left-3 top-3 rounded-full bg-black/70 px-3 py-2 text-xl leading-none text-white transition hover:bg-black/85 sm:left-5 sm:top-5"
              aria-label="閉じる"
            >
              ✕
            </button>
            {activeImages.length > 1 ? (
              <button
                type="button"
                onClick={showPrev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-2xl leading-none text-white transition hover:bg-black/85 sm:left-5"
                aria-label="前の写真"
              >
                ‹
              </button>
            ) : null}
            <img
              src={selectedImage}
              alt={`${activeLabel}ギャラリー ${selectedIndex + 1}`}
              className="max-h-full max-w-full object-contain select-none"
              draggable="false"
            />
            {activeImages.length > 1 ? (
              <button
                type="button"
                onClick={showNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/70 px-3 py-2 text-2xl leading-none text-white transition hover:bg-black/85 sm:right-5"
                aria-label="次の写真"
              >
                ›
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}

export default GalleryPage;
