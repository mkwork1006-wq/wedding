import { useState } from "react";

const navLinks = [
  { id: "hero", label: "トップ", href: "#hero" },
  { id: "seating", label: "席次表", href: "#seating" },
  { id: "courses", label: "コースメニュー", href: "#courses" },
  { id: "groom", label: "新郎プロフィール", href: "#groom" },
  { id: "bride", label: "新婦プロフィール", href: "#bride" },
  { id: "gallery", label: "ギャラリー", href: "#gallery" },
  { id: "faq", label: "Q&A", href: "#faq" }
];

const seatingPlan = [
  "玄関 / 受付スペース",
  "Table 1~3：ご友人・恩師",
  "Table 4~6：職場関係",
  "親族・家族テーブル"
];

const courseMenu = [
  "アミューズ：季節のアーティザンプレート",
  "冷前菜：海の幸のゼリー寄せ",
  "温前菜：フォアグラのポワレ",
  "魚料理：真鯛のコンフィ",
  "肉料理：和牛フィレのロースト",
  "デザート：シトラスのクレームブリュレ"
];

const bioSections = [
  {
    id: "groom",
    name: "新郎プロフィール",
    details: [
      "建築設計を志し、陰影と素材の関係を探求するクリエイター。",
      "手紙や光の演出を通じて、自宅のような安心感を届けたいと願う。"
    ]
  },
  {
    id: "bride",
    name: "新婦プロフィール",
    details: [
      "洋菓子職人として世界を旅し、食と香りを紡ぐ表現者。",
      "ゲストの時間に寄り添う甘さと、しずくのような繊細さを大切にする。"
    ]
  }
];

const galleryShots = [
  {
    title: "Morning Light",
    description: "朝のやわらかな光がふたりの笑顔を包む瞬間を捉えました。"
  },
  {
    title: "Architectural Calm",
    description: "アーチと天井から差す光の陰影が静けさを紡ぐ一場面です。"
  },
  {
    title: "Evening Glow",
    description: "キャンドルが揺らめくテーブルに、歓談するゲストの輪郭が浮かび上がる夜。"
  }
];

const faqs = [
  { question: "ドレスコードはありますか？", answer: "フォーマル寄りの装いを推奨していますが、肩肘張らないリネン調のセットアップも歓迎です。" },
  { question: "送迎はありますか？", answer: "希望者には最寄り駅からのシャトルをご案内いたします。事前にご相談ください。" },
  { question: "アレルギー対応は可能ですか？", answer: "アレルギーや苦手食材は事前にご連絡いただければ個別にご用意します。" }
];

const MenuPanel = ({ open, onClose }) => (
  <div
    className={`overflow-hidden transition-[max-height,padding] duration-300 ${
      open ? "max-h-[420px] py-6" : "max-h-0 py-0"
    }`}
  >
    <div
      className={`w-full border-b border-[#efeded] bg-white px-6 transition-shadow duration-300 ${
        open ? "shadow-[0_20px_60px_rgba(0,0,0,0.08)]" : "shadow-none"
      }`}
    >
      <nav className="flex flex-col gap-4 py-4 text-lg font-semibold text-[#1f1f1f]">
        {navLinks.map(({ id, label, href }) => (
          <a
            key={id}
            href={href}
            onClick={onClose}
            className="border-b border-[#f0f0f0] pb-3 transition hover:text-[#a1125a]"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  </div>
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <header className="sticky top-0 z-30 border-b border-[#efeded] bg-white backdrop-blur px-6 py-4 md:px-10">
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
            className="relative flex h-12 w-12 items-center justify-center md:hidden"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="ナビゲーションを開閉"
          >
            <span className="sr-only">メニュー</span>
            <span
              className={`absolute h-[2px] w-6 bg-[#1f1f1f] transition duration-300 ${
                menuOpen ? "translate-y-0 rotate-45" : "-translate-y-3"
              }`}
            />
            <span
              className={`absolute h-[2px] w-6 bg-[#1f1f1f] transition duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`absolute h-[2px] w-6 bg-[#1f1f1f] transition duration-300 ${
                menuOpen ? "translate-y-0 -rotate-45" : "translate-y-3"
              }`}
            />
          </button>
        </div>
        <MenuPanel open={menuOpen} onClose={() => setMenuOpen(false)} />
      </header>

      <main className="space-y-12 px-6 pb-12 pt-8 md:px-10">
        <section id="hero" className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <p className="text-xs uppercase tracking-[0.4em] text-[#8a8a8a]">tomotomo</p>
            <h1 className="text-4xl font-semibold leading-tight text-[#1f1f1f] md:text-5xl">
              清潔感のある白に、光と時間の余韻をのせたWedding Page。
            </h1>
            <p className="text-base text-[#4c4c4c]">
              入口から続く余白に沿ってストーリーを紡ぎ、ゲストが自分らしくいられる祝福をデザインします。
            </p>
          </div>
          <div className="space-y-3 rounded-[26px] border border-[#efeded] bg-[#fafafa] p-6 shadow-sm">
            <p className="text-xs uppercase tracking-[0.4em] text-[#a1125a]">memory</p>
            <h2 className="text-2xl font-semibold text-[#1f1f1f]">しなやかなヴォールト</h2>
            <p className="text-sm text-[#4c4c4c]">
              柔らかなラインで構成された空間は、ガラス越しの光を取り入れて心地よい流れをつくります。
            </p>
          </div>
        </section>

        <section id="seating" className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-24 bg-[#dad5d2]" />
            <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">seating</p>
          </div>
          <div className="flex flex-col gap-2 text-sm text-[#4c4c4c]">
            {seatingPlan.map((item) => (
              <p key={item} className="rounded-[18px] border border-[#f0f0f0] bg-white/80 p-3">
                {item}
              </p>
            ))}
          </div>
        </section>

        <section id="courses" className="space-y-4">
          <div className="flex items-center gap-4">
            <span className="h-px w-24 bg-[#dad5d2]" />
            <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">courses</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {courseMenu.map((course) => (
              <div
                key={course}
                className="rounded-[24px] border border-[#efeded] bg-white p-5 text-sm text-[#4c4c4c] shadow-sm"
              >
                {course}
              </div>
            ))}
          </div>
        </section>

        <section id="groom" className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-24 bg-[#dad5d2]" />
            <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">groom</p>
          </div>
          <div className="space-y-3 rounded-[22px] border border-[#efeded] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1f1f1f]">新郎プロフィール</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-[#4c4c4c]">
              {bioSections.find((item) => item.id === "groom")?.details.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
          </div>
        </section>

        <section id="bride" className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-24 bg-[#dad5d2]" />
            <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">bride</p>
          </div>
          <div className="space-y-3 rounded-[22px] border border-[#efeded] bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1f1f1f]">新婦プロフィール</h3>
            <ul className="list-disc space-y-2 pl-5 text-sm text-[#4c4c4c]">
              {bioSections.find((item) => item.id === "bride")?.details.map((text) => (
                <li key={text}>{text}</li>
              ))}
            </ul>
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

        <section id="faq" className="space-y-6">
          <div className="flex items-center gap-4">
            <span className="h-px w-24 bg-[#dad5d2]" />
            <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">Q&A</p>
          </div>
          <div className="space-y-4">
            {faqs.map(({ question, answer }) => (
              <article key={question} className="rounded-[22px] border border-[#efeded] bg-white p-5 shadow-sm">
                <p className="text-sm font-semibold text-[#1f1f1f]">{question}</p>
                <p className="mt-2 text-sm text-[#4c4c4c]">{answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
