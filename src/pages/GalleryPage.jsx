import { galleryShots } from "../data/content";

function GalleryPage() {
  return (
    <section className="space-y-6" id="gallery">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-[#1f1f1f]">ギャラリー</h2>
        <p className="text-xs uppercase tracking-[0.4em] text-[#7a7a7a]">moments</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {galleryShots.map(({ title, description }) => (
          <figure
            key={title}
            className="flex flex-col justify-end rounded-[26px] border border-white/70 bg-gradient-to-br from-[#1f1f1f] via-[#444444] to-[#d0cfd0] p-6 text-white shadow-[0_20px_60px_rgba(12,6,3,0.45)]"
          >
            <figcaption className="text-sm uppercase tracking-[0.45em] text-[#f1f1f1]">{title}</figcaption>
            <p className="mt-3 text-sm leading-relaxed text-white/80">{description}</p>
          </figure>
        ))}
      </div>
    </section>
  );
}

export default GalleryPage;
