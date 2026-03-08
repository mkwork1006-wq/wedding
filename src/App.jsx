import { Suspense, lazy, useEffect, useRef, useState } from "react";
import TopPage from "./pages/TopPage";

const SeatingPage = lazy(() => import("./pages/SeatingPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const TempPage = lazy(() => import("./pages/TempPage"));

const PASSWORD = "R80329";
const AUTH_STORAGE_KEY = "tomotomo-wedding-auth";

const pages = [
  { id: "hero", label: "トップ", component: TopPage },
  { id: "seating", label: "席次表", component: SeatingPage },
  { id: "courses", label: "コース料理", component: CoursesPage },
  { id: "profile", label: "プロフィール", component: ProfilePage },
  { id: "gallery", label: "ギャラリー", component: GalleryPage },
  { id: "faq", label: "ご質問", component: FaqPage },
  { id: "temp", label: "仮", component: TempPage }
];

const menuItems = [
  { id: "hero", label: "トップ" },
  { id: "seating", label: "席次表" },
  { id: "courses", label: "コース料理" },
  { id: "profile", label: "プロフィール" },
  { id: "gallery", label: "ギャラリー" }
];

const PageFallback = () => <div className="h-[45vh] w-full animate-pulse rounded-[22px] border border-[#efeded] bg-[#fafafa]" />;

const MenuPanel = ({ open, onSelect, onClose }) => (
  <div
    className={`absolute right-0 top-full z-40 w-[min(90vw,430px)] origin-top-right transition duration-300 ${
      open
        ? "pointer-events-auto translate-y-3 scale-100 opacity-100"
        : "pointer-events-none translate-y-0 scale-95 opacity-0"
    }`}
  >
    <div className="relative rounded-[2rem] border-[3px] border-[#b59bc7] bg-[#f9f5fc]/95 px-6 pb-7 pt-8 shadow-[0_22px_50px_rgba(115,85,136,0.24)] backdrop-blur-md">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#b59bc7] text-[#b59bc7] transition hover:bg-[#efe4f7]"
        aria-label="メニューを閉じる"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 6L18 18" strokeLinecap="round" />
          <path d="M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>

      <div className="pr-12">
        <p className="text-[clamp(1.4rem,5vw,2.05rem)] font-semibold tracking-[0.02em] text-[#b59bc7]">
          Tomoya &amp; Tomomi Wedding
        </p>
        <p className="mt-1 text-[0.7rem] tracking-[0.25em] text-[#c6b0d6]">MENU NAVIGATION</p>
      </div>

      <div className="mt-6 border-t border-[#d9c8e4] pt-5">
        <p className="font-['Playfair_Display'] text-[1.95rem] font-semibold leading-none tracking-[0.01em] text-[#b59bc7]">
          Menu
        </p>
      </div>

      <nav className="mt-6 grid grid-cols-2 gap-3 text-[#b59bc7] sm:grid-cols-3">
        {menuItems.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="rounded-2xl border border-[#ccb7de] bg-white/85 px-3 py-3 text-left text-sm font-semibold tracking-[0.06em] transition duration-200 hover:-translate-y-0.5 hover:border-[#b59bc7] hover:bg-white"
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
      <div className="pointer-events-none absolute inset-x-0 top-[-180px] h-[340px] bg-[radial-gradient(circle_at_top,rgba(130,130,130,0.08),transparent_62%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-[-200px] w-[280px] bg-[radial-gradient(circle_at_center,rgba(120,120,120,0.05),transparent_55%)]" />
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

            {error ? <p className="text-sm text-[color:var(--ink)]">{error}</p> : null}

            <button
              type="submit"
              className="w-full rounded-xl border border-[color:var(--ink)] bg-white px-4 py-3 text-sm font-semibold text-[color:var(--ink)] transition duration-300 hover:bg-[#faf5ff]"
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
  const menuLayerRef = useRef(null);

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

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }

    const handlePointerDown = (event) => {
      if (menuLayerRef.current?.contains(event.target)) {
        return;
      }
      setMenuOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  if (!isAuthenticated) {
    return <PasswordGate onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-white text-[color:var(--ink)]">
      <header
        className={`fixed inset-x-0 top-0 z-30 px-6 py-4 md:px-10 ${
          isTopPage ? "border-none bg-transparent" : "border-b border-[#b59bc7] bg-white/70 backdrop-blur-md"
        }`}
      >
        <div ref={menuLayerRef} className="relative mx-auto max-w-6xl">
          <div className="flex items-center justify-between gap-4">
            {isTopPage ? (
              <div className="h-12" />
            ) : (
              <p className="min-w-0 flex-1 whitespace-nowrap text-[clamp(0.875rem,2.6vw,1.7rem)] font-medium leading-[1.25] tracking-[0.02em] text-[#b59bc7]">
                Tomoya＆Tomomi Wedding
              </p>
            )}
            <button
              type="button"
              className={`relative inline-flex shrink-0 items-center justify-center rounded-full border border-[#b59bc7] px-5 transition ${
                isTopPage
                  ? "h-10 bg-white/85 text-sm font-semibold tracking-[0.12em] text-[#b59bc7] backdrop-blur-md hover:bg-white"
                  : "h-10 bg-white text-sm font-semibold tracking-[0.12em] text-[#b59bc7] hover:bg-[#faf5ff] md:h-11"
              }`}
              onClick={() => setMenuOpen((prev) => !prev)}
              aria-expanded={menuOpen}
              aria-label="ナビゲーションを開閉"
            >
              MENU
            </button>
          </div>
          <MenuPanel open={menuOpen} onSelect={handleSelect} onClose={() => setMenuOpen(false)} />
        </div>
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-140px] h-[260px] bg-[radial-gradient(circle_at_top,rgba(130,130,130,0.06),transparent_55%)]" />
        <div
          className={`relative mx-auto max-w-6xl space-y-12 px-6 pb-14 md:px-10 ${
            isTopPage ? "pt-0" : "pt-24 md:pt-28"
          }`}
        >
          <Suspense fallback={<PageFallback />}>
            <div key={activePage} className="animate-fade">
              <ActivePage onNavigate={handleSelect} />
            </div>
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
