import { useState } from "react";
import { profiles } from "../data/content";
import groomPhoto from "../assets/images/profile/tomoya_profile.png";
import bridePhoto from "../assets/images/profile/tomomi_profile.png";
import { SectionShell } from "../components/ui";

const profileTabs = [
  {
    id: "groom",
    label: "新郎",
    profile: profiles.groom,
    image: groomPhoto
  },
  {
    id: "bride",
    label: "新婦",
    profile: profiles.bride,
    image: bridePhoto
  }
];

function ProfileBlock({ profile, label, image }) {
  return (
    <div className="mx-auto w-full max-w-[26rem] animate-fade space-y-8 pb-8 text-center md:space-y-10">
      <div className="mx-auto w-full max-w-[15.5rem] md:max-w-[18rem]">
        <img
          src={image}
          alt={`${label}のプロフィール写真`}
          className="h-auto w-full object-contain"
          loading="lazy"
        />
      </div>

      <div className="space-y-3">
        <p className="text-[0.72rem] font-semibold tracking-[0.62em] text-[color:var(--subtle)]">{label}</p>
        <h3 className="text-[2.6rem] font-semibold leading-none tracking-[0.18em] text-[color:var(--ink)] md:text-[3.1rem]">
          {profile.name}
        </h3>
      </div>

      <dl className="space-y-6 text-[color:var(--ink)]">
        <div className="space-y-2">
          <dt className="text-[0.72rem] font-semibold tracking-[0.48em] text-[color:var(--subtle)]">誕生日</dt>
          <dd className="text-[1.9rem] font-semibold leading-tight tracking-[0.05em] md:text-[2.35rem]">
            {profile.birthday}
          </dd>
        </div>
        <div className="space-y-2">
          <dt className="text-[0.72rem] font-semibold tracking-[0.48em] text-[color:var(--subtle)]">出身地</dt>
          <dd className="text-base font-semibold tracking-[0.08em] md:text-lg">{profile.hometown}</dd>
        </div>
        <div className="space-y-2">
          <dt className="text-[0.72rem] font-semibold tracking-[0.48em] text-[color:var(--subtle)]">好きなもの</dt>
          <dd className="flex flex-wrap justify-center gap-x-2 gap-y-1 text-sm tracking-[0.04em]">
            {profile.likes.map((item) => (
              <span key={item}>{`#${item}`}</span>
            ))}
          </dd>
        </div>
        <div className="space-y-2">
          <dt className="text-[0.72rem] font-semibold tracking-[0.48em] text-[color:var(--subtle)]">
            {profile.partnerFavoriteLabel}
          </dt>
          <dd className="text-sm leading-relaxed text-[color:var(--ink)] md:text-base">
            {profile.partnerFavorite}
          </dd>
        </div>
        <div className="space-y-2">
          <dt className="text-[0.72rem] font-semibold tracking-[0.48em] text-[color:var(--subtle)]">
            {profile.messageLabel}
          </dt>
          <dd className="text-sm leading-relaxed text-[color:var(--ink)] md:text-base">{profile.message}</dd>
        </div>
      </dl>
    </div>
  );
}

function ProfilePage({ id = "profile", initialProfile = "groom" }) {
  const defaultProfile = initialProfile === "bride" ? "bride" : "groom";
  const [activeProfile, setActiveProfile] = useState(defaultProfile);

  const currentProfile = profileTabs.find((tab) => tab.id === activeProfile) ?? profileTabs[0];

  return (
    <SectionShell id={id}>
      <div className="mx-auto w-full max-w-[28rem] space-y-6 md:space-y-8">
        <div className="text-center">
          <p className="mb-1 text-[10px] tracking-[0.34em] text-[color:var(--subtle)]">✦ PROFILE</p>
          <div className="inline-flex items-center gap-3 text-[2rem] font-semibold leading-none text-[color:var(--ink)] md:text-[2.2rem]">
            {profileTabs.map((tab, index) => (
              <div key={tab.id} className="inline-flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveProfile(tab.id)}
                  aria-pressed={activeProfile === tab.id}
                  className={`transition duration-200 ${
                    activeProfile === tab.id ? "opacity-100" : "opacity-45 hover:opacity-70"
                  }`}
                >
                  {tab.label}
                </button>
                {index === 0 ? <span className="text-[1.6rem] font-medium opacity-70">/</span> : null}
              </div>
            ))}
          </div>
        </div>

        <ProfileBlock
          key={currentProfile.id}
          profile={currentProfile.profile}
          label={currentProfile.label}
          image={currentProfile.image}
        />
      </div>
    </SectionShell>
  );
}

export default ProfilePage;
