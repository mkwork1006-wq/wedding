import { useState } from "react";
import { profiles } from "../data/content";
import groomPhoto from "../assets/images/profile/shinrou.png";
import bridePhoto from "../assets/images/profile/shinpu.png";
import { SectionShell } from "../components/ui";

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
  const targetLabel = isToBride ? "新婦" : "新郎";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${targetLabel}プロフィールへ`}
      className="group absolute right-2 top-2 z-10 text-xs font-semibold tracking-[0.28em] text-[color:var(--ink)] transition hover:text-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent)]"
    >
      <span className="text-[11px]">{`${targetLabel}>>`}</span>
    </button>
  );
}

function ProfileSlide({ profile, label, imagePosition, image }) {
  const isImageLeft = imagePosition === "left";
  const gridClass = isImageLeft ? "grid-cols-[0.88fr_1.12fr]" : "grid-cols-[0.8fr_1.2fr]";
  return (
    <div className={`grid items-stretch gap-4 md:gap-12 ${gridClass}`}>
      <div
        className={`flex flex-col gap-6 text-center md:text-left ${
          isImageLeft ? "order-2 md:order-2" : "order-1 md:order-1"
        }`}
      >
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.48em] text-[color:var(--subtle)]">{label}</p>
          <h3 className="text-2xl font-semibold text-[color:var(--ink)] md:text-3xl">{profile.name}</h3>
        </div>
        <dl className="space-y-5 text-sm text-[color:var(--ink)] md:text-base">
          <div className="space-y-1">
            <dt className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--subtle)]">誕生日</dt>
            <dd className="text-base font-semibold md:text-lg">{profile.birthday}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--subtle)]">血液型</dt>
            <dd className="text-base font-semibold md:text-lg">{profile.bloodType}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--subtle)]">出身地</dt>
            <dd className="text-base font-semibold md:text-lg">{profile.hometown}</dd>
          </div>
          <div className="space-y-1">
            <dt className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--subtle)]">仕事</dt>
            <dd className="text-base font-semibold md:text-lg">{profile.job}</dd>
          </div>
          <div className="space-y-2">
            <dt className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--subtle)]">
              好きなもの
            </dt>
            <dd className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-xs text-[color:var(--subtle)] md:justify-start">
              {profile.likes.map((item) => (
                <span key={item}>{`#${item}`}</span>
              ))}
            </dd>
          </div>
          <div className="space-y-2">
            <div className="mx-auto h-px w-10 bg-[#e6e8f2] md:mx-0" />
            <dt className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--subtle)]">
              みんなに一言
            </dt>
            <dd className="text-[color:var(--ink)]">{profile.message}</dd>
          </div>
        </dl>
      </div>
      <div className={`flex ${isImageLeft ? "order-1 md:order-1" : "order-2 md:order-2"}`}>
        <div className="w-full min-h-[380px] overflow-hidden bg-white md:min-h-[620px]">
          <img
            src={image}
            alt={`${label}のプロフィール写真`}
            className="h-full w-full object-contain object-center"
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
                      ? "pl-2 pr-[10px] md:pl-8 md:pr-[10px]"
                      : "pl-[10px] pr-4 md:pl-[10px] md:pr-12"
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
