import { useState } from "react";
import { profiles } from "../data/content";
import groomPhoto from "../assets/images/profile/shinrou.jpg";
import bridePhoto from "../assets/images/profile/shinpu.jpg";
import { Pill, SectionShell } from "../components/ui";

const profileSlides = [
  {
    id: "groom",
    label: "新郎",
    profile: profiles.groom,
    imagePosition: "right",
    image: groomPhoto
  },
  {
    id: "bride",
    label: "新婦",
    profile: profiles.bride,
    imagePosition: "left",
    image: bridePhoto
  }
];

function ArrowButton({ isGroom, onClick }) {
  const isToBride = isGroom;
  const isLeft = !isToBride;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isToBride ? "新婦プロフィールへ" : "新郎プロフィールへ"}
      className={`group absolute top-1/2 z-10 flex -translate-y-1/2 items-center gap-0.5 p-1 text-[color:var(--accent)] transition-opacity duration-300 hover:opacity-80 motion-reduce:transition-none ${
        isLeft ? "left-0 flex-row-reverse" : "right-0 flex-row"
      }`}
    >
      <span className="relative grid min-w-[1.35rem]">
        <span
          className={`col-start-1 row-start-1 text-sm font-semibold tracking-[0.24em] transition-all duration-500 motion-reduce:transition-none ${
            isToBride ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0"
          }`}
          style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
        >
          新婦
        </span>
        <span
          className={`col-start-1 row-start-1 text-sm font-semibold tracking-[0.24em] transition-all duration-500 motion-reduce:transition-none ${
            isToBride ? "translate-y-2 opacity-0" : "translate-y-0 opacity-100"
          }`}
          style={{ writingMode: "vertical-rl", textOrientation: "upright" }}
        >
          新郎
        </span>
      </span>
      <svg
        viewBox="0 0 48 72"
        className={`h-9 w-5 transition-transform duration-500 motion-reduce:transition-none ${
          isLeft ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M10 8L38 36L10 64" />
      </svg>
    </button>
  );
}

function ProfileSlide({ profile, label, imagePosition, image }) {
  const isImageLeft = imagePosition === "left";
  const gridClass = isImageLeft ? "grid-cols-[0.88fr_1.12fr]" : "grid-cols-[1.12fr_0.88fr]";
  return (
    <div className={`grid items-stretch gap-4 md:gap-12 ${gridClass}`}>
      <div
        className={`flex flex-col gap-5 ${
          isImageLeft ? "order-2 md:order-2" : "order-1 md:order-1"
        }`}
      >
        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.48em] text-[color:var(--subtle)]">{label}</p>
          <h3 className="text-lg font-semibold text-[color:var(--ink)] md:text-2xl">{profile.name}</h3>
          <p className="text-xs text-[color:var(--muted)] md:text-sm">{profile.headline}</p>
        </div>
        <ul className="list-disc space-y-2 pl-5 text-[11px] text-[color:var(--muted)] md:text-sm">
          {profile.details.map((text) => (
            <li key={text}>{text}</li>
          ))}
        </ul>
        <div className="flex flex-wrap gap-2">
          {profile.tags.map((tag) => (
            <Pill key={tag}>{tag}</Pill>
          ))}
        </div>
      </div>
      <div className={`flex ${isImageLeft ? "order-1 md:order-1" : "order-2 md:order-2"}`}>
        <div className="w-full min-h-[320px] overflow-hidden bg-white md:min-h-[520px]">
          <img
            src={image}
            alt={`${label}のプロフィール写真`}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

function ProfilePage({ id = "profile", initialProfile = "groom" }) {
  const [activeProfile, setActiveProfile] = useState(initialProfile);
  const isGroom = activeProfile === "groom";

  return (
    <SectionShell id={id} eyebrow="プロフィール">
      <div className="relative">
        <div className="overflow-hidden">
          <div className="relative">
          <div
            className="flex w-[200%] transition-transform duration-700 ease-in-out motion-reduce:transition-none"
            style={{ transform: `translateX(${isGroom ? "0%" : "-50%"})` }}
          >
            {profileSlides.map((slide) => {
              const isActive = slide.id === activeProfile;
              const nextProfile = slide.id === "groom" ? "bride" : "groom";
              return (
                <div
                  key={slide.id}
                  className={`relative w-1/2 py-5 md:py-10 ${
                    slide.id === "groom"
                      ? "pl-4 pr-14 md:pl-12 md:pr-20"
                      : "pl-14 pr-4 md:pl-20 md:pr-12"
                  } ${isActive ? "pointer-events-auto" : "pointer-events-none"}`}
                >
                  <ProfileSlide
                    profile={slide.profile}
                    label={slide.label}
                    imagePosition={slide.imagePosition}
                    image={slide.image}
                  />
                  <ArrowButton
                    isGroom={slide.id === "groom"}
                    onClick={() => setActiveProfile(nextProfile)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </SectionShell>
  );
}

export default ProfilePage;
