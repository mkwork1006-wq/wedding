import { courseMenu } from "../data/content";

const drinkMenu = [
  {
    title: "DRINK",
    categories: [
      {
        name: "ビール",
        items: ["キリンビール"]
      },
      {
        name: "ウィスキー",
        items: ["バレンタインスコッチ"]
      },
      {
        name: "酒",
        items: ["日本酒《初孫》", "麦焼酎《壱岐》"]
      },
      {
        name: "ワイン",
        items: ["赤ワイン", "白ワイン"]
      },
      {
        name: "カクテル",
        items: [
          "ハイボール",
          "ジントニック",
          "ファジーネーブル",
          "モスコミュール",
          "カシスソーダ",
          "レモンサワー",
          "プラムカクテル",
          "季節のカクテル"
        ]
      },
      {
        name: "ソフトドリンク",
        items: ["ウーロン茶", "オレンジジュース", "グレープジュース", "ミネラルウォーター"]
      }
    ]
  }
];

function CoursesPage() {
  return (
    <section id="courses" className="mx-auto w-full max-w-2xl space-y-5 pb-4">
      <div className="pt-1 text-center">
        <p className="text-[10px] tracking-[0.34em] text-[color:var(--subtle)]">✦ COURSE MEAL</p>
      </div>

      <div className="relative">
        <span
          className="pointer-events-none absolute bottom-4 left-[11px] top-4 w-px bg-gradient-to-b from-[#e8ddec] via-[#d8c7e2] to-[#e8ddec]"
          aria-hidden="true"
        />
        <div className="space-y-3">
          {courseMenu.map(({ title, detail }, index) => (
            <div key={title} className="relative pl-8">
              <span className="absolute left-0 top-1/2 inline-flex h-[22px] w-[22px] -translate-y-1/2 items-center justify-center rounded-full border border-[#d5c0e0] bg-white text-[9px] font-semibold tracking-[0.08em] text-[#b59bc7] shadow-[0_3px_10px_rgba(181,155,199,0.16)]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <article className="rounded-[14px] border border-[#e0d3e8] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(181,155,199,0.1)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_rgba(181,155,199,0.16)] sm:px-5">
                <p className="text-[12px] font-semibold tracking-[0.14em] text-[#c4b2cf]">{title}</p>
                <p className="mt-1 pl-4 text-[16px] font-semibold leading-relaxed text-[#b59bc7]">{detail}</p>
              </article>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 pt-4">
        {drinkMenu.map(({ title, items, categories }) => (
          <section key={title} className="space-y-4">
            <div className="text-center">
              <p className="text-[10px] tracking-[0.34em] text-[color:var(--subtle)]">✦ {title}</p>
            </div>
            <article className="rounded-[14px] border border-[#d9c7e4] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(181,155,199,0.08)] sm:px-5">
              {categories ? (
                <div className="space-y-4">
                  {categories.map((category) => (
                    <div
                      key={category.name}
                      className={`space-y-1.5 ${
                        category.name === "ソフトドリンク" ? "mt-5 border-t border-[#e3d8ea] pt-4" : ""
                      }`}
                    >
                      <p className="text-[12px] font-semibold tracking-[0.14em] text-[#c4b2cf]">
                        {category.name}
                      </p>
                      <ul className="space-y-1 pl-1">
                        {category.items.map((item) => (
                          <li
                            key={item}
                            className="pl-4 text-[16px] font-semibold leading-relaxed text-[#b59bc7]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-0.5">
                  {items.map((item) => (
                    <li key={item} className="text-[15px] font-medium leading-relaxed text-[#b59bc7]">
                      ・{item}
                    </li>
                  ))}
                </ul>
              )}
            </article>
          </section>
        ))}
      </div>
    </section>
  );
}

export default CoursesPage;
