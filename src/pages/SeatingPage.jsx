import { seatingPlan } from "../data/content";
import { SectionShell, SurfaceCard } from "../components/ui";

function SeatingPage() {
  return (
    <SectionShell
      id="seating"
      eyebrow="席次"
      title="席次表"
      description="入口からご家族席までの動線をコンパクトにまとめました。"
    >
      <div className="grid gap-3 md:grid-cols-2">
        {seatingPlan.map(({ title, note }) => (
          <SurfaceCard
            key={title}
            tone="muted"
            className="p-4 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d9ccd333]"
          >
            <p className="text-sm font-semibold text-[color:var(--ink)]">{title}</p>
            <p className="mt-2 text-xs text-[color:var(--muted)]">{note}</p>
          </SurfaceCard>
        ))}
      </div>
    </SectionShell>
  );
}

export default SeatingPage;
