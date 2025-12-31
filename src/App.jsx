import { useState } from "react";
import TopPage from "./pages/TopPage";
import SeatingPage from "./pages/SeatingPage";
import CoursesPage from "./pages/CoursesPage";
import GroomPage from "./pages/GroomPage";
import BridePage from "./pages/BridePage";
import GalleryPage from "./pages/GalleryPage";
import FaqPage from "./pages/FaqPage";
import { Pill } from "./components/ui";

const pages = [
  { id: "hero", label: "トップ", component: TopPage },
  { id: "seating", label: "席次表", component: SeatingPage },
  { id: "courses", label: "コースメニュー", component: CoursesPage },
  { id: "groom", label: "新郎プロフィール", component: GroomPage },
  { id: "bride", label: "新婦プロフィール", component: BridePage },
  { id: "gallery", label: "ギャラリー", component: GalleryPage },
  { id: "faq", label: "ご質問", component: FaqPage }
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
      <nav className="flex flex-col gap-4 py-4 text-lg font-semibold text-[#1f1f1f]">
        {pages.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            className="border-b border-[#f0f0f0] pb-3 text-left transition hover:text-[#a1125a]"
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  </div>
);

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activePage, setActivePage] = useState("hero");

  const ActivePage = pages.find((page) => page.id === activePage)?.component ?? TopPage;

  const handleSelect = (id) => {
    setActivePage(id);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <header className="sticky top-0 z-30 border-b border-[#efeded] bg-white/90 px-6 py-4 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs uppercase tracking-[0.6em] text-[#7a7a7a]">tomotomo wedding</p>
            <p className="text-lg font-semibold">光と余白でつなぐ一日</p>
            <div className="flex flex-wrap gap-2 md:hidden">
              <Pill>2025.11.23</Pill>
              <Pill>都内邸宅</Pill>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {pages.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className={`transition-colors ${
                  activePage === id ? "text-[#a1125a]" : "text-[#1f1f1f]"
                }`}
              >
                {label}
              </button>
            ))}
          </nav>
          <div className="hidden items-center gap-2 md:flex">
            <Pill>2025.11.23</Pill>
            <Pill>都内邸宅</Pill>
          </div>
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
        <MenuPanel open={menuOpen} onSelect={handleSelect} />
      </header>

      <main className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 top-[-140px] h-[260px] bg-[radial-gradient(circle_at_top,rgba(161,18,90,0.08),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-[-180px] w-[260px] bg-[radial-gradient(circle_at_center,rgba(31,31,31,0.05),transparent_50%)]" />
        <div className="relative mx-auto max-w-6xl space-y-12 px-6 pb-14 pt-10 md:px-10">
          <div key={activePage} className="animate-fade">
            <ActivePage />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
