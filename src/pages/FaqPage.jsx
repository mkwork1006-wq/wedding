import { faqs } from "../data/content";

function FaqPage() {
  return (
    <section className="space-y-6" id="faq">
      <div className="flex items-center gap-4">
        <span className="h-px w-24 bg-[#dad5d2]" />
        <p className="text-xs uppercase tracking-[0.5em] text-[#7a7a7a]">Q&A</p>
      </div>
      <div className="space-y-4">
        {faqs.map(({ question, answer }) => (
          <article key={question} className="rounded-[22px] border border-[#efeded] bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold text-[#1f1f1f]">{question}</p>
            <p className="mt-2 text-sm text-[#4c4c4c]">{answer}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FaqPage;
