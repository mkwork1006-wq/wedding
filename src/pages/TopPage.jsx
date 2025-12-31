import { heroHighlights } from "../data/content";
import { Pill, SurfaceCard } from "../components/ui";

function TopPage() {
  return (
    <section className="space-y-8" id="hero">
      <div className="grid gap-8 md:grid-cols-[1.25fr_0.85fr] md:items-start">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.4em] text-[#8a8a8a]">tomotomo</p>
          <h1 className="text-4xl font-semibold leading-tight text-[#1f1f1f] md:text-5xl">
            白の余白に、光と時間のレイヤーを重ねたウェディングページ。
          </h1>
          <p className="text-base text-[#4c4c4c]">
            ゲストが自分らしく呼吸できるよう、動線・香り・音・明かりをゆるやかに整えました。
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {heroHighlights.map(({ title, description }) => (
              <SurfaceCard
                key={title}
                tone="muted"
                className="p-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d9ccd333]"
              >
                <p className="text-[11px] uppercase tracking-[0.4em] text-[#7a7a7a]">{title}</p>
                <p className="mt-2 text-sm text-[#3f3f3f]">{description}</p>
              </SurfaceCard>
            ))}
          </div>
        </div>
        <SurfaceCard
          tone="frosted"
          className="p-6 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(0,0,0,0.12)]"
        >
          <p className="text-xs tracking-[0.4em] text-[#a1125a]">コンセプト</p>
          <h2 className="mt-2 text-2xl font-semibold text-[#1f1f1f]">しなやかなヴォールト</h2>
          <p className="mt-3 text-sm text-[#4c4c4c]">
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
          <p className="text-xs tracking-[0.4em] text-[#7a7a7a]">お約束</p>
          <p className="text-sm text-[#4c4c4c]">
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
