import { useEffect, useState } from "react";
import { heroHighlights } from "../data/content";
import { Pill, SurfaceCard } from "../components/ui";

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

function TopPage({ onNavigate }) {
  const [activeIndex, setActiveIndex] = useState(() => {
    if (!heroSlides.length) {
      return 0;
    }
    return Math.floor(Math.random() * heroSlides.length);
  });
  const [isPaused, setIsPaused] = useState(false);
  const totalSlides = heroSlides.length;
  const quickLinks = [
    { id: "seating", label: "座席表", image: buttonImages["zasakihyou_button.png"] ?? null },
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

  return (
    <section className="space-y-10" id="hero">
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
            className="relative h-[570px] w-full md:h-[670px]"
            role="region"
            aria-roledescription="carousel"
            aria-label="トップビジュアルのカルーセル"
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
              <p className="origin-center rotate-180 font-['Noto_Sans_JP'] text-[34px] font-semibold leading-none tracking-[0.04em] text-[#ff3a2d] [writing-mode:vertical-rl] [text-orientation:mixed]">
                Welcome to our Wedding
              </p>
            </div>
          </div>
        ) : (
          <div className="h-[570px] w-full bg-[#f2f4f8] md:h-[670px]" />
        )}
        {totalSlides > 1 ? (
          <div className="relative z-20 flex items-center justify-center gap-2 bg-white/95 py-5">
            {heroSlides.map((slide, index) => (
              <button
                key={`${slide}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2.5 w-2.5 rounded-full transition-colors ${
                  index === activeIndex ? "bg-[color:var(--accent)]" : "bg-[#cfd4e4] md:hover:bg-[color:var(--accent)]"
                }`}
                aria-label={`スライド ${index + 1}へ`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>
        ) : null}
      </SurfaceCard>
      <div className="space-y-3 text-center">
        <p className="mb-2 text-5xl font-semibold leading-none text-[color:var(--ink)] md:text-6xl">03/29</p>
        <p className="mx-auto max-w-4xl text-sm text-[color:var(--muted)] md:text-base">
          本日はお忙しい中、私たちの結婚式にお越しいただきありがとうございます。このサイトでは座席表、コース料理、プロフィール、ギャラリーを掲載しております。ぜひご活用ください！
        </p>
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
              <div className="aspect-square overflow-hidden rounded-2xl border border-[#efeded] bg-[#fafafa] shadow-sm transition group-hover:-translate-y-0.5 group-hover:border-[color:var(--accent)]">
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
              className="text-sm font-semibold text-[color:var(--ink)] underline decoration-[1.5px] underline-offset-4 transition hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
              aria-label={`${label}へ`}
            >
              {label}
            </button>
          </div>
        ))}
      </div>
      <div className="grid gap-8 md:grid-cols-[1.25fr_0.85fr] md:items-start">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[color:var(--subtle)]">tomotomo</p>
          <h1 className="text-4xl font-semibold leading-tight text-[color:var(--ink)] md:text-5xl">
            白の余白に、光と時間のレイヤーを重ねたウェディングページ。
          </h1>
          <p className="text-base text-[color:var(--muted)]">
            ゲストが自分らしく呼吸できるよう、動線・香り・音・明かりをゆるやかに整えました。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {heroHighlights.map(({ title, description }) => (
              <SurfaceCard
                key={title}
                tone="muted"
                className="p-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d9ccd333]"
              >
                <p className="text-[11px] uppercase tracking-[0.4em] text-[color:var(--subtle)]">{title}</p>
                <p className="mt-2 text-sm text-[color:var(--muted)]">{description}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>
        <SurfaceCard
          tone="frosted"
          className="p-6 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
        >
          <p className="text-xs tracking-[0.4em] text-[color:var(--accent)]">コンセプト</p>
          <h2 className="mt-2 text-2xl font-semibold text-[color:var(--ink)]">しなやかなヴォールト</h2>
          <p className="mt-3 text-sm text-[color:var(--muted)]">
            柔らかな曲線で構成された空間に、ガラス越しの光を取り入れて心地よい流れをつくります。
            時間帯に合わせてキャンドルと音楽を調整し、静けさと温度が交互に訪れるリズムを描きます。
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>光のゆらぎ</Pill>
            <Pill>余白の安心感</Pill>
            <Pill>素材の静けさ</Pill>
          </div>
        </SurfaceCard>
      </div>
      <SurfaceCard tone="plain" className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-2">
          <p className="text-xs tracking-[0.4em] text-[color:var(--subtle)]">お約束</p>
          <p className="text-sm text-[color:var(--muted)]">
            招待状から当日の導線まで「静かに寄り添う設計」で統一。モバイルでも読みやすいタイポグラフィと、
            スクロールを誘いすぎないコンパクトなセクション配置を意識しています。
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Pill>ゲストファースト</Pill>
          <Pill>モバイルフレンドリー</Pill>
          <Pill>軽やかなアニメーション</Pill>
        </div>
      </SurfaceCard>
    </section>
  );
}

export default TopPage;
