import { useEffect, useRef, useState } from "react";
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
  const [selected, setSelected] = useState(null);
  const sentinelRef = useRef(null);
  const loadingRef = useRef(false);

  const activeImages = activeTab === "groom" ? groomSources : brideSources;
  const activeLabel = activeTab === "groom" ? "新郎" : "新婦";

  useEffect(() => {
    const images = activeTab === "groom" ? groomSources : brideSources;
    setSelected(null);
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

  useEffect(() => {
    if (!selected) {
      return undefined;
    }
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setSelected(null);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [selected]);

  return (
    <SectionShell
      id="gallery"
      eyebrow="ギャラリー"
      title="ギャラリー"
      description="正方形のフレームに、ふたりの空気感を等間隔で並べました。タブで切り替え、タップで拡大できます。"
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
                onClick={() => setSelected({ src: item.src, alt: `${activeLabel}ギャラリー ${index + 1}` })}
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

      {selected ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/90 px-6 py-10 backdrop-blur-sm"
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label="拡大画像"
        >
          <div
            className="relative w-full max-w-4xl flex flex-col items-start gap-3"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              className="text-2xl leading-none text-[color:var(--ink)] transition hover:text-[color:var(--ink)]"
              aria-label="閉じる"
            >
              ✕
            </button>
            <img
              src={selected.src}
              alt={selected.alt}
              className="max-h-[80vh] w-full rounded-3xl object-contain shadow-[0_30px_80px_rgba(0,0,0,0.18)]"
            />
          </div>
        </div>
      ) : null}
    </SectionShell>
  );
}

export default GalleryPage;
