import { profiles } from "../data/content";
import { Pill, SectionShell, SurfaceCard } from "../components/ui";

function GroomPage() {
  const profile = profiles.groom;
  return (
    <SectionShell id="groom" eyebrow="新郎" title={profile.name} description={profile.headline}>
      <SurfaceCard className="p-6 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d9ccd333]">
        <ul className="list-disc space-y-2 pl-5 text-sm text-[color:var(--muted)]">
          {profile.details.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <div className="mt-4 flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </SurfaceCard>
    </SectionShell>
  );
}

export default GroomPage;
