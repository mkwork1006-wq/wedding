import { bioSections } from "../data/content";

function BridePage() {
  const section = bioSections.find((item) => item.id === "bride");
  return (
    <section className="space-y-6" id="bride">
      <div className="flex items-center gap-4">
        <span className="h-px w-24 bg-[#dad5d2]" />
        <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">bride</p>
      </div>
      <div className="space-y-3 rounded-[22px] border border-[#efeded] bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-[#1f1f1f]">{section?.name}</h3>
        <ul className="list-disc space-y-2 pl-5 text-sm text-[#4c4c4c]">
          {section?.details.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default BridePage;
