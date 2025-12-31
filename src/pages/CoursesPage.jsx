import { courseMenu } from "../data/content";
import { SectionShell, SurfaceCard } from "../components/ui";

function CoursesPage() {
  return (
    <SectionShell
      id="courses"
      eyebrow="コース"
      title="コースメニュー"
      description="季節の香りと温度を意識した 6 皿のコース。進行に合わせて音と照明もゆるやかに変化します。"
    >
      <div className="grid gap-3 md:grid-cols-2">
        {courseMenu.map(({ title, detail, note }) => (
          <SurfaceCard
            key={title}
            className="p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d9ccd333]"
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[#1f1f1f]">{title}</p>
              <span className="text-[10px] tracking-[0.32em] text-[#7a7a7a]">コース</span>
            </div>
            <p className="mt-1 text-sm text-[#3f3f3f]">{detail}</p>
            <p className="mt-1 text-xs text-[#4c4c4c]">{note}</p>
          </SurfaceCard>
        ))}
      </div>
    </SectionShell>
  );
}

export default CoursesPage;
