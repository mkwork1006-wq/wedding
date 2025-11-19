import { useState } from "react";

const navLinks = [
  { id: "hero", label: "トップ" },
  { id: "profile", label: "プロフィール" },
  { id: "menu-section", label: "メニュー" },
  { id: "gallery", label: "ギャラリー" }
];

const profileHighlights = [
  {
    title: "コンセプト",
    description:
      "静かに光が踊り、余白が心地よいリズムを刻む空間。素材感は自然と調和するマットな仕上げで、肩肘張らず過ごせるウェルカムなムードです。"
  },
  {
    title: "空間設計",
    description:
      "回廊のような導線と、天井から降る柔らかい光のラインが特徴。光の色温度を変えることで時間の移ろいを演出します。"
  },
  {
    title: "サービス",
    description:
      "ご家族・ご友人のペースを最優先に考えた構成と、ミニマルな演出で余韻を残すおもてなしを。"
  }
];

const menuEntries = [
  { label: "事業内容", href: "#menu-section" },
  { label: "企業情報", href: "#profile" },
  { label: "ニュース", href: "#gallery" },
  { label: "IR情報", href: "#hero" },
  { label: "サステナビリティ", href: "#hero" },
  { label: "採用情報", href: "#profile" }
];

const menuHighlights = [
  { title: "トップページ", description: "白とグレーを基調にしたヒーローで第一印象をコントロール。" },
  { title: "プロフィール", description: "おふたりの軌跡と想いを静かに紡ぐセクション設計。" },
  { title: "メニュー", description: "構成と進行、当日の流れを丁寧に記したページ。" },
  { title: "ギャラリー", description: "光や質感、ゲストとの瞬間を残すビジュアルギャラリー。" }
];

const galleryShots = [
  {
    title: "Morning Light",
    description: "日の出のようなグラデーションを背景に、穏やかな笑顔を写した一枚。"
  },
  {
    title: "Architectural Calm",
    description: "アーチと壁の陰影が静けさを際立たせ、緊張をほどく風景。"
  },
  {
    title: "Evening Glow",
    description: "キャンドルの光が踊るテーブルと、歓談するゲストの温かな輪郭。"
  }
];

const MenuPanel = ({ open, onClose }) => (
  <div
    className={`overflow-hidden transition-[max-height,padding] duration-300 ${
      open ? "max-h-[440px] py-8" : "max-h-0 py-0"
    }`}
  >
    <div
      className={`w-full rounded-b-[28px] border border-[#d8d5d2] bg-[#042d2a] px-6 py-6 text-white/90 transition-colors duration-300 ${
        open ? "shadow-[0_20px_60px_rgba(4,45,42,0.35)]" : "shadow-none"
      }`}
    >
      <div className="flex items-center justify-between">
        <p className="text-xs uppercase tracking-[0.5em] text-white/60">menu</p>
        <button
          type="button"
          onClick={onClose}
          className="flex items-center gap-2 rounded-md border border-white/60 px-3 py-2 text-xs uppercase tracking-[0.4em]"
        >
          CLOSE
          <span className="text-sm">✕</span>
        </button>
      </div>
      <div className="mt-6 space-y-4 text-lg font-semibold">
        {menuEntries.map((entry) => (
          <a
            key={entry.label}
            href={entry.href}
            onClick={onClose}
            className="flex items-center justify-between border-b border-white/10 pb-3 transition hover:text-[#c2f0df]"
          >
            <span>{entry.label}</span>
            <span className="text-xs text-white/60">→</span>
          </a>
        ))}
      </div>
    </div>
  </div>
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <header className="sticky top-0 z-30 border-b border-[#efeded] bg-white/90 px-6 py-4 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] text-[#7a7a7a]">tomotomo wedding</p>
            <p className="text-lg font-semibold">2025.11.23 / 都内邸宅</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map(({ id, label }) => (
              <a key={id} href={`#${id}`} className="transition-colors hover:text-[#a1125a]">
                {label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            className="relative flex h-12 w-32 items-center justify-center border border-[#ded7d1] text-sm font-semibold uppercase tracking-[0.35em] text-[#1f1f1f] transition hover:border-[#a1125a] md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="ナビゲーションを開閉"
          >
            <span className="absolute right-3">≡</span>
            MENU
          </button>
        </div>
        <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>

      <main className="space-y-12 px-6 pb-12 pt-8 md:px-10">
        <section id="hero" className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[#8a8a8a]">tomotomo</p>
            <h1 className="text-4xl font-semibold leading-tight text-[#1f1f1f] md:text-5xl">
              清潔感を纏った光と余白が紡ぐウェディングストーリー。
            </h1>
            <p className="text-base text-[#4c4c4c]">
              ガラス越しに漂うリネンの白、木の温度、天井から舞い降りる柔らかな光。トップページではその余韻を先に感じられるよう、シンプルな構図を採用しました。
            </p>
            <div className="flex flex-wrap gap-3">
              <button className="rounded-full border border-[#1f1f1f] px-6 py-3 text-xs font-semibold uppercase tracking-[0.5em] transition hover:bg-[#f8f4f2]">
                参加する
              </button>
              <span className="self-center text-xs uppercase tracking-[0.5em] text-[#8a8a8a]">
                プロフィールへ
              </span>
            </div>
          </div>
          <div className="space-y-3 rounded-[26px] border border-[#efeded] bg-[#fafafa] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-[#a1125a]">memory</p>
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">しなやかなヴォールト</h2>
            <p className="text-sm text-[#4c4c4c]">
              丸く柔らかなラインが空間を包み込み、ゲストの視線を自然と流すデザインです。透明感のある素材で、やさしい反射をつくり出します。
            </p>
            <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.4em] text-[#a1125a]">
              <span className="rounded-full border border-[#f2d7d2] px-3 py-1">柔らかな光</span>
              <span className="rounded-full border border-[#f2d7d2] px-3 py-1">クラシックピアノ</span>
            </div>
          </div>
        </section>

        <section id="profile" className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-24 bg-[#dad5d2]" />
            <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">profile</p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {profileHighlights.map(({ title, description }) => (
              <article
                key={title}
                className="space-y-3 rounded-[20px] border border-[#f0eeea] bg-white p-5 shadow-sm"
              >
                <p className="text-sm font-semibold tracking-[0.35em] text-[#a1125a]">{title}</p>
                <p className="text-sm text-[#4c4c4c]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="menu-section" className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-24 bg-[#dad5d2]" />
            <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">menu</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {menuHighlights.map(({ title, description }) => (
              <article
                key={title}
                className="space-y-3 rounded-[24px] border border-[#efeded] bg-white p-6 shadow-sm"
              >
                <p className="text-sm uppercase tracking-[0.4em] text-[#a1125a]">{title}</p>
                <p className="text-base text-[#4c4c4c]">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="gallery" className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">ギャラリー</h2>
            <p className="text-xs uppercase tracking-[0.4em] text-[#7a7a7a]">moments</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {galleryShots.map(({ title, description }) => (
              <figure
                key={title}
                className="flex flex-col justify-end rounded-[26px] border border-white/70 bg-gradient-to-br from-[#1f1f1f] via-[#444444] to-[#d0cfd0] p-6 text-white shadow-[0_20px_60px_rgba(12,6,3,0.45)]"
              >
                <figcaption className="text-sm uppercase tracking-[0.45em] text-[#f1f1f1]">{title}</figcaption>
                <p className="mt-3 text-sm leading-relaxed text-white/80">{description}</p>
              </figure>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
