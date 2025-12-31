import { galleryShots } from "../data/content";
import { SectionShell, SurfaceCard } from "../components/ui";

function GalleryPage() {
  return (
    <SectionShell
      id="gallery"
      eyebrow="ギャラリー"
      title="ギャラリー"
      description="光の移ろいを切り取った 3 つの瞬間。空気感まで伝わる質感を意識しました。"
    >
      <div className="grid gap-4 md:grid-cols-3">
        {galleryShots.map(({ title, description }) => (
          <SurfaceCard key={title} tone="glow" className="flex flex-col justify-end p-6 hover:-translate-y-1">
            <p className="text-sm uppercase tracking-[0.45em] text-[#f1f1f1]">{title}</p>
            <p className="mt-3 text-sm leading-relaxed text-white/85">{description}</p>
          </SurfaceCard>
        ))}
      </div>
    </SectionShell>
  );
}

export default GalleryPage;
