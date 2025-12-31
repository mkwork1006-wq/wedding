import { useMemo } from "react";
import { heroHighlights } from "../data/content";
import { Pill, SurfaceCard } from "../components/ui";

const topImages = Object.values(
  import.meta.glob("../assets/images/top/TOP_*.*", {
    eager: true,
    import: "default"
  })
);

function TopPage({ onNavigate }) {
  const heroImage = useMemo(() => {
    if (!topImages.length) {
      return "";
    }
    const index = Math.floor(Math.random() * topImages.length);
    return topImages[index];
  }, []);
  const isTopB = heroImage.includes("TOP_B");
  const quickLinks = [
    { id: "seating", label: "席次表" },
    { id: "courses", label: "コースメニュー" },
    { id: "profile", label: "プロフィール" },
    { id: "gallery", label: "ギャラリー" },
    { id: "faq", label: "ご質問" },
    { id: "temp", label: "仮" }
  ];

  return (
    <section className="space-y-10" id="hero">
      <SurfaceCard
        tone="plain"
        className="relative left-1/2 w-screen -translate-x-1/2 -mt-10 overflow-hidden rounded-none p-0 shadow-[0_26px_70px_rgba(10,28,60,0.12)]"
      >
        {heroImage ? (
          <img
            src={heroImage}
            alt="トップビジュアル"
            className="h-[570px] w-full object-cover object-bottom-shift animate-hero-zoom md:h-[670px]"
            style={isTopB ? { objectPosition: "center calc(100% + 75px)" } : undefined}
          />
        ) : (
          <div className="h-[570px] w-full bg-[#f2f4f8] md:h-[670px]" />
        )}
        <div className="pointer-events-none absolute inset-x-0 -bottom-[2px] h-[10px] bg-gradient-to-t from-white to-transparent" />
        <div className="absolute inset-0 flex items-start justify-end p-6 md:p-10">
          <div className="max-w-[240px] text-right font-['Noto_Sans_JP'] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)] md:max-w-sm">
            <p className="text-xs uppercase tracking-[0.6em]">Wedding Atelier</p>
            <p className="mt-6 text-3xl font-semibold leading-tight md:text-5xl">Discover the light</p>
            <p className="mt-2 text-2xl font-semibold md:text-4xl">and awaken your vow.</p>
          </div>
        </div>
      </SurfaceCard>
      <p className="text-center text-sm text-[color:var(--muted)] md:text-base">
        ご列席の皆さまへ、本日心からの感謝を込めて
      </p>
      <div className="mx-auto grid max-w-3xl grid-cols-3 gap-3 sm:gap-4">
        {quickLinks.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onNavigate?.(id)}
            className="group flex min-h-[64px] items-center justify-center rounded-2xl border border-[#efeded] bg-white px-3 py-3 text-[13px] font-semibold text-[color:var(--ink)] shadow-sm transition hover:-translate-y-0.5 hover:border-[color:var(--accent)] hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)] md:text-sm"
          >
            <span className="text-center leading-tight">{label}</span>
          </button>
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
