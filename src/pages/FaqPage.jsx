import { faqs } from "../data/content";
import { SectionShell, SurfaceCard } from "../components/ui";

function FaqPage() {
  return (
    <SectionShell id="faq" eyebrow="ご質問" title="ご質問" description="よくある質問をまとめました。事前の相談もお気軽に。">
      <div className="space-y-4">
        {faqs.map(({ question, answer }) => (
          <SurfaceCard
            key={question}
            className="p-5 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d9ccd333]"
          >
            <p className="text-sm font-semibold text-[color:var(--ink)]">{question}</p>
            <p className="mt-2 text-sm text-[color:var(--muted)]">{answer}</p>
          </SurfaceCard>
        ))}
      </div>
    </SectionShell>
  );
}

export default FaqPage;
