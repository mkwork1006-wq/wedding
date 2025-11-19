import { seatingPlan } from "../data/content";

function SeatingPage() {
  return (
    <section className="space-y-6" id="seating">
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
  );
}

export default SeatingPage;
