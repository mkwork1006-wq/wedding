import { useEffect, useMemo, useState } from "react";

const seatingImages = Object.entries(
  import.meta.glob("../assets/images/seating/*.{png,jpg,jpeg,webp,avif}", {
    eager: true,
    import: "default"
  })
)
  .sort(([pathA], [pathB]) => pathA.localeCompare(pathB))
  .map(([, src]) => src);

// この配列を後から実データに差し替えるだけで検索対象を更新できます。
const seatingGuestList = [
  { name: "福野　光一", table: "A" },
  { name: "福野　南", table: "A" },
  { name: "永里　天識", table: "A" },
  { name: "戸井田　智之", table: "A" },
  { name: "渡邉　一世", table: "A" },
  { name: "里中　宏夢", table: "A" },
  { name: "堀田　朋花", table: "A" },
  { name: "野瀬　歩夢", table: "B" },
  { name: "齊藤　宏輔", table: "B" },
  { name: "井上　裕斗", table: "B" },
  { name: "石川　拓也", table: "B" },
  { name: "蛭間　俊介", table: "B" },
  { name: "蛭間　凛空", table: "B" },
  { name: "蛭間　麟", table: "B" },
  { name: "松村　温子", table: "C" },
  { name: "加藤　美雪", table: "C" },
  { name: "宮﨑　花怜", table: "C" },
  { name: "大淵　緋奈", table: "C" },
  { name: "竹内　保乃華", table: "C" },
  { name: "石塚　心聖", table: "C" },
  { name: "市川　桜", table: "C" },
  { name: "菅家　凪沙", table: "D" },
  { name: "菅家　浩平", table: "D" },
  { name: "菅原　葵", table: "D" },
  { name: "菅原　大翔", table: "D" },
  { name: "石川　美咲", table: "D" },
  { name: "熊　偉傑", table: "D" },
  { name: "森山　みゆき", table: "D" },
  { name: "山上　亜弥", table: "D" },
  { name: "川村　逸生", table: "E" },
  { name: "岩井　桃花", table: "E" },
  { name: "征矢　依央里", table: "E" },
  { name: "福山　直弥", table: "E" },
  { name: "冨野　剛史", table: "E" },
  { name: "許田　雄大", table: "E" },
  { name: "大沼　明梨", table: "F" },
  { name: "佐藤　里咲", table: "F" },
  { name: "橋本　明寿香", table: "F" },
  { name: "濱田　世菜", table: "F" },
  { name: "笠原　健吾", table: "F" },
  { name: "大西　廣太", table: "F" },
  { name: "古川　真穂", table: "F" },
  { name: "新宮　隼", table: "F" },
  { name: "齊藤　貴祐", table: "G" },
  { name: "箕輪　駿", table: "G" },
  { name: "千葉　彩瑛", table: "G" },
  { name: "宮脇　聡志", table: "G" },
  { name: "小松　由佳", table: "G" },
  { name: "佐々木　そよ香", table: "G" },
  { name: "津々木　雄太", table: "H" },
  { name: "津々木　実久", table: "H" },
  { name: "富松　晃子", table: "H" },
  { name: "井殿　玲香", table: "H" },
  { name: "井殿　佑太", table: "H" },
  { name: "藤木　真央", table: "I" },
  { name: "清野　みな実", table: "I" },
  { name: "川上　智也", table: "I" },
  { name: "小川　陸", table: "I" },
  { name: "小林　信彦", table: "I" },
  { name: "青山　千尋", table: "J" },
  { name: "鈴木　美希", table: "J" },
  { name: "森木　知里", table: "J" },
  { name: "福元　郁弥", table: "J" },
  { name: "内海　慶祐", table: "J" },
  { name: "瀧田　幹夫", table: "J" },
  { name: "山下　優理", table: "K" },
  { name: "山下　達也", table: "K" },
  { name: "山下　美智子", table: "K" },
  { name: "武田　美優", table: "K" },
  { name: "武田　直栄", table: "K" },
  { name: "山下　俊也", table: "K" },
  { name: "井本　航輔", table: "L" },
  { name: "井本　勝博", table: "L" },
  { name: "登尾　利明", table: "L" },
  { name: "井本　修慈", table: "L" },
  { name: "井本　美和子", table: "L" },
  { name: "登尾　美千代", table: "L" },
  { name: "神谷　仁基", table: "M" },
  { name: "南　美咲", table: "M" },
  { name: "高畑　真菜美", table: "M" },
  { name: "高畑　卓弥", table: "M" },
  { name: "高畑　結菜", table: "M" },
  { name: "高畑　壮真", table: "M" },
  { name: "神谷　祐果", table: "M" },
  { name: "神谷　真実", table: "M" },
  { name: "神谷　修司", table: "N" },
  { name: "神谷　資子", table: "N" },
  { name: "神谷　元則", table: "N" },
  { name: "神谷　京", table: "N" },
  { name: "有原　英生", table: "N" },
  { name: "有原　秀子", table: "N" },
  { name: "有原　可奈", table: "N" },
  { name: "有原　大揮", table: "N" }
];

const normalizeSearchText = (value) => value.replace(/[\s\u3000]+/g, "");

function SeatingPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const seatingImage = seatingImages[0] ?? null;
  const normalizedQuery = normalizeSearchText(searchText);

  const filteredGuests = useMemo(() => {
    if (!normalizedQuery) {
      return [];
    }

    return seatingGuestList.filter((guest) =>
      normalizeSearchText(guest.name).includes(normalizedQuery)
    );
  }, [normalizedQuery]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  return (
    <section id="seating" className="mx-auto w-full max-w-3xl space-y-5 pb-4">
      <div className="text-center">
        <p className="text-[10px] tracking-[0.34em] text-[color:var(--subtle)]">✦ SEATING CHART</p>
      </div>

      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="block w-full border border-[#b59bc7] bg-white text-left transition duration-300 hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b59bc7]"
        aria-label="席次表画像を拡大表示"
      >
        {seatingImage ? (
          <img
            src={seatingImage}
            alt="席次表画像"
            className="h-auto w-full object-contain"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-[4/3] w-full items-center justify-center px-4">
            <p className="text-center text-2xl leading-relaxed text-black">
              席次表画像
              <br />
              （まだ未作成）
            </p>
          </div>
        )}
      </button>

      <div className="space-y-3 pt-1">
        <label htmlFor="guest-search" className="sr-only">
          お名前検索
        </label>
        <div className="relative">
          <input
            id="guest-search"
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="ご氏名を漢字でご入力ください"
            className="h-14 w-full rounded-2xl border-[3px] border-[#b59bc7] bg-white px-5 py-0 pr-16 text-2xl leading-[3.5rem] text-[#b59bc7] outline-none transition placeholder:text-lg placeholder:leading-[3.5rem] placeholder:text-[#ccb7d9] focus:border-[#b59bc7] focus:ring-2 focus:ring-[#e2d8ea]"
          />
          <span
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-[#b59bc7]"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="11" cy="11" r="7.2" />
              <path d="M16.3 16.3L21 21" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {normalizedQuery ? (
          filteredGuests.length > 0 ? (
            <div className="space-y-2 pt-1">
              <p className="px-1 text-xs tracking-[0.08em] text-[#ccb7d9]">
                検索結果 {filteredGuests.length} 件
              </p>
              <ul className="space-y-2">
                {filteredGuests.map((guest) => (
                  <li
                    key={guest.name}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-[#d9c8e4] bg-white/95 px-4 py-3 shadow-[0_8px_20px_rgba(181,155,199,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-[#b59bc7]"
                  >
                    <p className="text-[clamp(1.05rem,4.1vw,1.4rem)] font-medium tracking-[0.02em] text-[#b59bc7]">
                      {guest.name}
                    </p>
                    <span className="shrink-0 rounded-full border border-[#b59bc7] bg-[#faf7fd] px-3 py-1 text-sm font-semibold tracking-[0.04em] text-[#b59bc7]">
                      {guest.table} テーブル
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded-2xl border border-[#d9c8e4] bg-white/95 px-4 py-4 text-base text-[#b59bc7] shadow-[0_8px_20px_rgba(181,155,199,0.08)]">
              該当するお名前が見つかりませんでした。
            </p>
          )
        ) : (
          <p className="rounded-2xl border border-[#d9c8e4] bg-white/95 px-4 py-4 text-base text-[#b59bc7] shadow-[0_8px_20px_rgba(181,155,199,0.08)]">
            ご氏名を入力するとテーブル名が表示されます。
          </p>
        )}
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-white/90 px-4 py-8 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="席次表画像の拡大表示"
        >
          <div className="w-full max-w-5xl" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="mb-3 text-sm font-medium tracking-[0.06em] text-[#7c6988] transition hover:text-[#5f4f69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b59bc7]"
            >
              閉じる
            </button>
            {seatingImage ? (
              <img
                src={seatingImage}
                alt="席次表画像（拡大）"
                className="max-h-[82vh] w-full border border-[#b59bc7] bg-white object-contain"
              />
            ) : (
              <div className="flex min-h-[60vh] w-full items-center justify-center border border-[#b59bc7] bg-white px-4">
                <p className="text-center text-3xl leading-relaxed text-black">
                  席次表画像
                  <br />
                  （まだ未作成）
                </p>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default SeatingPage;
