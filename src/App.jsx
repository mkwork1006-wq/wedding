import { useState } from "react";
import TopPage from "./pages/TopPage";
import SeatingPage from "./pages/SeatingPage";
import CoursesPage from "./pages/CoursesPage";
import GroomPage from "./pages/GroomPage";
import BridePage from "./pages/BridePage";
import GalleryPage from "./pages/GalleryPage";
import FaqPage from "./pages/FaqPage";

const navLinks = [
  { id: "hero", label: "トップ" },
  { id: "seating", label: "席次表" },
  { id: "courses", label: "コースメニュー" },
  { id: "groom", label: "新郎プロフィール" },
  { id: "bride", label: "新婦プロフィール" },
  { id: "gallery", label: "ギャラリー" },
  { id: "faq", label: "Q&A" }
];

const pageComponents = {
  hero: <TopPage />,
  seating: <SeatingPage />,
  courses: <CoursesPage />,
  groom: <GroomPage />,
  bride: <BridePage />,
  gallery: <GalleryPage />,
  faq: <FaqPage />
};

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
        {navLinks.map(({ id, label }) => (
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

  const handleSelect = (id) => {
    setActivePage(id);
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-white text-[#1f1f1f]">
      <header className="sticky top-0 z-30 border-b border-[#efeded] bg-white/90 backdrop-blur px-6 py-4 md:px-10">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.6em] text-[#7a7a7a]">tomotomo wedding</p>
            <p className="text-lg font-semibold">2025.11.23 / 都内邸宅</p>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            {navLinks.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                onClick={() => handleSelect(id)}
                className={`transition-colors ${activePage === id ? "text-[#a1125a]" : "text-[#1f1f1f]"}`}
              >
                {label}
              </button>
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
        <MenuPanel open={menuOpen} onSelect={handleSelect} />
      </header>

      <main className="space-y-12 px-6 pb-12 pt-8 md:px-10">
        {pageComponents[activePage] || <TopPage />}
      </main>
    </div>
  );
}

export default App;
