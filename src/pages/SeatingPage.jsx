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
  { name: "福野　光一", table: "A", nickname: "ふくの" },
  { name: "福野　南", table: "A", nickname: "みなみ" },
  { name: "永里　天識", table: "A", nickname: "たかしくん" },
  { name: "戸井田　智之", table: "A", nickname: "ゆき" },
  { name: "渡邉　一世", table: "A", nickname: "わたいち" },
  { name: "里中　宏夢", table: "A", nickname: "さっぴー" },
  { name: "堀田　朋花", table: "A", nickname: "ほった" },
  { name: "野瀬　歩夢", table: "B", nickname: "あゆむ" },
  { name: "齊藤　宏輔", table: "B", nickname: "こうすけ" },
  { name: "井上　裕斗", table: "B", nickname: "ひろと" },
  { name: "石川　拓也", table: "B", nickname: "いしたく" },
  { name: "蛭間　俊介", table: "B", nickname: "しゅんすけ" },
  { name: "蛭間　凛空", table: "B", nickname: "りあちゃん" },
  { name: "蛭間　麟", table: "B", nickname: "りんさん" },
  { name: "松村　温子", table: "C", nickname: "あっちゃん" },
  { name: "加藤　美雪", table: "C", nickname: "みゆき" },
  { name: "宮﨑　花怜", table: "C", nickname: "かれん" },
  { name: "大淵　緋奈", table: "C", nickname: "ひなっち" },
  { name: "竹内　保乃華", table: "C", nickname: "ほのか" },
  { name: "石塚　心聖", table: "C", nickname: "みっちゃん" },
  { name: "市川　桜", table: "C", nickname: "さくら" },
  { name: "菅家　凪沙", table: "D", nickname: "なぎ" },
  { name: "菅家　浩平", table: "D", nickname: "こうへいくん" },
  { name: "菅原　葵", table: "D", nickname: "わだ" },
  { name: "菅原　大翔", table: "D", nickname: "ぽめ" },
  { name: "石川　美咲", table: "D", nickname: "みさきちゃん" },
  { name: "熊　偉傑", table: "D", nickname: "くま" },
  { name: "森山　みゆき", table: "D", nickname: "みゆ" },
  { name: "山上　亜弥", table: "D", nickname: "あや" },
  { name: "川村　逸生", table: "E", nickname: "いつき" },
  { name: "岩井　桃花", table: "E", nickname: "ももか" },
  { name: "征矢　依央里", table: "E", nickname: "いおり" },
  { name: "福山　直弥", table: "E", nickname: "なおや" },
  { name: "冨野　剛史", table: "E", nickname: "とみの" },
  { name: "許田　雄大", table: "E", nickname: "きょだ" },
  { name: "大沼　明梨", table: "F", nickname: "あかり" },
  { name: "佐藤　里咲", table: "F", nickname: "りさ" },
  { name: "橋本　明寿香", table: "F", nickname: "あすか" },
  { name: "濱田　世菜", table: "F", nickname: "せいな" },
  { name: "笠原　健吾", table: "F", nickname: "けんけん" },
  { name: "大西　廣太", table: "F", nickname: "みすたー" },
  { name: "古川　真穂", table: "F", nickname: "まほ" },
  { name: "新宮　隼", table: "F", nickname: "はやと" },
  { name: "齊藤　貴祐", table: "G", nickname: "おかたさん" },
  { name: "箕輪　駿", table: "G", nickname: "みのしゅん" },
  { name: "千葉　彩瑛", table: "G", nickname: "さえ" },
  { name: "宮脇　聡志", table: "G", nickname: "宮脇くん" },
  { name: "小松　由佳", table: "G", nickname: "ゆか" },
  { name: "佐々木　そよ香", table: "G", nickname: "そよちゃん" },
  { name: "津々木　雄太", table: "H", nickname: "ゆうたくん" },
  { name: "津々木　実久", table: "H", nickname: "みくちゃん" },
  { name: "富松　晃子", table: "H", nickname: "あっこちゃん" },
  { name: "井殿　玲香", table: "H", nickname: "れいかさん" },
  { name: "井殿　佑太", table: "H", nickname: "ゆうたくん" },
  { name: "藤木　真央", table: "I", nickname: "まお" },
  { name: "清野　みな実", table: "I", nickname: "みなみ" },
  { name: "川上　智也", table: "I", nickname: "ともや" },
  { name: "小川　陸", table: "I", nickname: "りく" },
  { name: "小林　信彦", table: "I", nickname: "のぶ" },
  { name: "青山　千尋", table: "J", nickname: "ちひろ" },
  { name: "鈴木　美希", table: "J", nickname: "みきてぃ" },
  { name: "森木　知里", table: "J", nickname: "ちさと" },
  { name: "福元　郁弥", table: "J", nickname: "ふみや" },
  { name: "内海　慶祐", table: "J", nickname: "かり" },
  { name: "瀧田　幹夫", table: "J", nickname: "みきお" },
  { name: "山下　優理", table: "K", nickname: "ゆうりさん" },
  { name: "山下　達也", table: "K", nickname: "たっちゃん" },
  { name: "山下　美智子", table: "K", nickname: "お母さん" },
  { name: "武田　美優", table: "K", nickname: "みゆうちゃん" },
  { name: "武田　直栄", table: "K", nickname: "ただえさん" },
  { name: "山下　俊也", table: "K", nickname: "おとうさん" },
  { name: "井本　航輔", table: "L", nickname: "こうすけ" },
  { name: "井本　勝博", table: "L", nickname: "かっちゃん" },
  { name: "登尾　利明", table: "L", nickname: "おじいちゃん" },
  { name: "井本　修慈", table: "L", nickname: "しゅうじ" },
  { name: "井本　美和子", table: "L", nickname: "みーちゃん" },
  { name: "登尾　美千代", table: "L", nickname: "おばあちゃん" },
  { name: "神谷　仁基", table: "M", nickname: "まさ" },
  { name: "南　美咲", table: "M", nickname: "みさきさん" },
  { name: "高畑　真菜美", table: "M", nickname: "まな" },
  { name: "高畑　卓弥", table: "M", nickname: "たくぴー" },
  { name: "高畑　結菜", table: "M", nickname: "ゆいなちゃん" },
  { name: "高畑　壮真", table: "M", nickname: "そうまくん" },
  { name: "神谷　祐果", table: "M", nickname: "ゆかちゃん" },
  { name: "神谷　真実", table: "M", nickname: "まみちゃん" },
  { name: "神谷　修司", table: "N", nickname: "お父さん" },
  { name: "神谷　資子", table: "N", nickname: "お母さん" },
  { name: "神谷　元則", table: "N", nickname: "もとのりおじさん" },
  { name: "神谷　京", table: "N", nickname: "みやこおばさん" },
  { name: "有原　英生", table: "N", nickname: "ひできおじさん" },
  { name: "有原　秀子", table: "N", nickname: "ひでこおばさん" },
  { name: "有原　可奈", table: "N", nickname: "かなちゃん" },
  { name: "有原　大揮", table: "N", nickname: "ひろきくん" }
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

    return seatingGuestList.filter((guest) => {
      const searchableTexts = [guest.name, guest.nickname].filter(Boolean);

      return searchableTexts.some((value) => normalizeSearchText(value).includes(normalizedQuery));
    });
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
            decoding="async"
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
          お名前またはあだ名検索
        </label>
        <p className="px-1 text-[10px] tracking-[0.18em] text-[#c4b2cf]">テーブル検索</p>
        <div className="overflow-hidden rounded-[8px] border-[2px] border-[#b59bc7] bg-white shadow-[0_10px_22px_rgba(181,155,199,0.12)] transition duration-300 focus-within:shadow-[0_14px_30px_rgba(181,155,199,0.2)]">
          <div className="flex items-stretch">
            <input
              id="guest-search"
              type="text"
              value={searchText}
              onChange={(event) => setSearchText(event.target.value)}
              placeholder="ご氏名またはあだ名で検索してください"
              className="h-12 w-full flex-1 border-none bg-white px-4 text-[17px] font-semibold tracking-[0.03em] text-[#b59bc7] outline-none placeholder:text-[15px] placeholder:font-medium placeholder:tracking-[0.04em] placeholder:text-[#ccb7d9]"
            />
            <span
              className="pointer-events-none inline-flex h-12 w-12 shrink-0 items-center justify-center border-l border-[#b59bc7] bg-[#b59bc7] text-white"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="11" cy="11" r="7.2" />
                <path d="M16.3 16.3L21 21" strokeLinecap="round" />
              </svg>
            </span>
          </div>
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
                    key={`${guest.table}-${guest.name}`}
                    className="flex items-center justify-between gap-3 rounded-[14px] border border-[#d9c8e4] bg-white/95 px-4 py-3 shadow-[0_8px_20px_rgba(181,155,199,0.12)] transition duration-200 hover:-translate-y-0.5 hover:border-[#b59bc7]"
                  >
                    <div className="min-w-0">
                      <p className="text-[clamp(1.05rem,4.1vw,1.4rem)] tracking-[0.02em] text-[#b59bc7]">
                        <span className="font-medium">{guest.name}</span>
                        {guest.nickname ? (
                          <span className="font-light text-[#b59bc7]/80"> / {guest.nickname}</span>
                        ) : null}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full border border-[#b59bc7] bg-[#faf7fd] px-3 py-1 text-sm font-semibold tracking-[0.04em] text-[#b59bc7]">
                      {guest.table} テーブル
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <p className="rounded-[14px] border border-[#d9c8e4] bg-white/95 px-4 py-4 text-base text-[#b59bc7] shadow-[0_8px_20px_rgba(181,155,199,0.08)]">
              該当するお名前が見つかりませんでした。
            </p>
          )
        ) : (
          <p className="rounded-[14px] border border-[#d9c8e4] bg-white/95 px-4 py-4 text-base text-[#b59bc7] shadow-[0_8px_20px_rgba(181,155,199,0.08)]">
            ご氏名またはあだ名を入力するとテーブル名が表示されます。
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
              className="mb-3 text-3xl leading-none text-[#7c6988] transition hover:text-[#5f4f69] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b59bc7]"
              aria-label="席次表画像を閉じる"
            >
              ×
            </button>
            {seatingImage ? (
              <img
                src={seatingImage}
                alt="席次表画像（拡大）"
                className="max-h-[82vh] w-full border border-[#b59bc7] bg-white object-contain"
                decoding="async"
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
