export function SectionShell({ id, eyebrow, title, description, children }) {
  return (
    <section id={id} className="space-y-5">
      <div className="space-y-2">
        {eyebrow ? (
          <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.48em] text-[color:var(--subtle)]">
            <span className="h-px w-12 bg-[#e8e4e2] sm:w-20" />
            <span>{eyebrow}</span>
            <span className="hidden h-px flex-1 max-w-[120px] bg-[#e8e4e2] sm:block" />
          </div>
        ) : null}
        {title ? <h2 className="text-xl font-semibold text-[color:var(--ink)] md:text-2xl">{title}</h2> : null}
        {description ? <p className="text-sm text-[color:var(--muted)]">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

const toneStyles = {
  plain: "border border-[#efeded] bg-white shadow-sm",
  muted: "border border-[#efeded] bg-[#fafafa]",
  frosted: "border border-[#efeded] bg-white/80 backdrop-blur shadow-[0_20px_60px_rgba(8,8,8,0.06)]",
  glow:
    "border border-white/50 bg-gradient-to-br from-[#1f1f1f] via-[#4b4a4b] to-[#d6d4d5] text-white shadow-[0_20px_80px_rgba(12,6,3,0.32)]"
};

export function SurfaceCard({ tone = "plain", className = "", children }) {
  const toneClass = toneStyles[tone] ?? toneStyles.plain;
  return (
    <div className={`group rounded-[22px] transition duration-300 ${toneClass} ${className}`}>
      {children}
    </div>
  );
}

export function Pill({ children }) {
  return (
    <span className="rounded-full border border-[#e9e6e3] bg-white px-3 py-1 text-xs font-medium text-[color:var(--muted)] shadow-sm">
      {children}
    </span>
  );
}
