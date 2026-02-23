import { useState } from "react";
import TopPage from "./pages/TopPage";
import SeatingPage from "./pages/SeatingPage";
import CoursesPage from "./pages/CoursesPage";
import ProfilePage from "./pages/ProfilePage";
import GalleryPage from "./pages/GalleryPage";
import FaqPage from "./pages/FaqPage";
import TempPage from "./pages/TempPage";
import { Pill } from "./components/ui";

const PASSWORD = "R80329";
const AUTH_STORAGE_KEY = "tomotomo-wedding-auth";

const pages = [
  { id: "hero", label: "トップ", component: TopPage },
  { id: "seating", label: "席次表", component: SeatingPage },
  { id: "courses", label: "コースメニュー", component: CoursesPage },
  { id: "profile", label: "プロフィール", component: ProfilePage },
  { id: "gallery", label: "ギャラリー", component: GalleryPage },
  { id: "faq", label: "ご質問", component: FaqPage },
  { id: "temp", label: "仮", component: TempPage }
];

const MenuPanel = ({ open, onSelect }) => (
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
      <nav className="flex flex-col gap-4 py-4 text-lg font-semibold text-[color:var(--ink)]">
        {pages.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="border-b border-[#f0f0f0] pb-3 text-left transition hover:text-[color:var(--accent)]"
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

const PasswordGate = ({ onUnlock }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (input === PASSWORD) {
      onUnlock();
      setInput("");
      setError("");
      return;
    }

    setError("パスワードが正しくありません。");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-white px-6 py-12 text-[color:var(--ink)]">
      <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[340px] bg-[radial-gradient(circle_at_top,rgba(11,47,214,0.1),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-[-200px] w-[280px] bg-[radial-gradient(circle_at_center,rgba(0,20,137,0.05),transparent_55%)]" />
      <div className="relative mx-auto flex min-h-[80vh] w-full max-w-xl items-center justify-center">
        <div className="w-full rounded-3xl border border-[#efeded] bg-white/90 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.08)] backdrop-blur">
          <p className="text-xs uppercase tracking-[0.45em] text-[color:var(--subtle)]">tomotomo wedding</p>
          <h1 className="mt-3 text-2xl font-semibold md:text-3xl">ご招待ゲスト専用ページ</h1>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--subtle)]">
            閲覧にはパスワードの入力が必要です。招待状に記載のコードをご入力ください。
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">パスワード</span>
              <input
                type="password"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  if (error) {
                    setError("");
                  }
                }}
                className="w-full rounded-xl border border-[#dfdfdf] px-4 py-3 text-base outline-none transition focus:border-[color:var(--accent)] focus:ring-2 focus:ring-[color:var(--accent)]/20"
                autoComplete="current-password"
                placeholder="パスワードを入力"
              />
            </label>

            {error ? <p className="text-sm text-[#d53535]">{error}</p> : null}

            <button
              type="submit"
              className="w-full rounded-xl bg-[color:var(--ink)] px-4 py-3 text-sm font-semibold text-white transition duration-300 hover:bg-[color:var(--accent)]"
            >
              サイトに入る
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(AUTH_STORAGE_KEY) === "true";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("hero");
  const isTopPage = activePage === "hero";

  const ActivePage = pages.find((page) => page.id === activePage)?.component ?? TopPage;

  const handleUnlock = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(AUTH_STORAGE_KEY, "true");
    }

    setIsAuthenticated(true);
  };

  const handleSelect = (id) => {
    setActivePage(id);
    setMenuOpen(false);
  };

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-white text-[color:var(--ink)]">
      <header
        className={`top-0 z-30 px-6 py-4 md:px-10 ${
          isTopPage
            ? "fixed inset-x-0 border-none bg-transparent"
            : "sticky border-b border-[#efeded] bg-white/90 backdrop-blur"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          {!isTopPage ? (
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.6em] text-[color:var(--subtle)]">tomotomo wedding</p>
              <p className="text-lg font-semibold">光と余白でつなぐ一日</p>
              <div className="flex flex-wrap gap-2 md:hidden">
                <Pill>2025.11.23</Pill>
                <Pill>都内邸宅</Pill>
              </div>
            </div>
          ) : (
            <div className="h-12" />
          )}
          {!isTopPage ? (
            <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
              {pages.map(({ id, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleSelect(id)}
                  className={`transition-colors ${
                    activePage === id ? "text-[color:var(--accent)]" : "text-[color:var(--ink)]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </nav>
          ) : null}
          {!isTopPage ? (
            <div className="hidden items-center gap-2 md:flex">
              <Pill>2025.11.23</Pill>
              <Pill>都内邸宅</Pill>
            </div>
          ) : null}
          <button
            type="button"
            className={`relative inline-flex items-center justify-center text-sm font-semibold tracking-[0.12em] transition ${
              isTopPage ? "h-10 text-[#ff3a2d]" : "h-12 md:hidden"
            }`}
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-expanded={menuOpen}
            aria-label="ナビゲーションを開閉"
          >
            MENU
          </button>
        </div>
        <MenuPanel open={menuOpen} onSelect={handleSelect} />
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-140px] h-[260px] bg-[radial-gradient(circle_at_top,rgba(11,47,214,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-[-180px] w-[260px] bg-[radial-gradient(circle_at_center,rgba(0,20,137,0.05),transparent_50%)]" />
        <div className={`relative mx-auto max-w-6xl space-y-12 px-6 pb-14 md:px-10 ${isTopPage ? "pt-0" : "pt-10"}`}>
          <div key={activePage} className="animate-fade">
            <ActivePage onNavigate={handleSelect} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
