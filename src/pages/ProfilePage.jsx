import { useState } from "react";
import { profiles } from "../data/content";
import groomPhoto from "../assets/images/profile/groom_profile.jpg";
import bridePhoto from "../assets/images/profile/bride_profile.jpg";
import bearPhoto from "../assets/images/etc/bear.jpg";
import { SectionShell } from "../components/ui";

const profileTabs = [
  {
    id: "groom",
    label: "groom",
    profile: profiles.groom,
    image: groomPhoto
  },
  {
    id: "bride",
    label: "bride",
    profile: profiles.bride,
    image: bridePhoto
  }
];

function ProfileBlock({ profile, label, image, isBride }) {
  return (
    <div className="mx-auto w-full max-w-[26rem] animate-fade space-y-8 pb-8 text-center md:space-y-10">
      <div className="relative left-1/2 w-screen -translate-x-1/2 overflow-hidden">
        <img
          src={image}
          alt={`${label}のプロフィール写真`}
          className="h-auto w-full object-cover object-center"
          loading="lazy"
          decoding="async"
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
          <dd className="whitespace-pre-line text-sm leading-relaxed text-[color:var(--ink)] md:text-base">
            {profile.partnerFavorite}
          </dd>
        </div>
        <div className="space-y-2">
          <dt className="text-[0.72rem] font-semibold tracking-[0.48em] text-[color:var(--subtle)]">
            {profile.messageLabel}
          </dt>
          <dd className="whitespace-pre-line text-sm leading-relaxed text-[color:var(--ink)] md:text-base">
            {profile.message}
          </dd>
        </div>
      </dl>

      {isBride ? (
        <section className="mx-auto w-full overflow-hidden rounded-[14px] bg-[color:var(--ink)] p-3 text-left text-white shadow-[0_16px_30px_rgba(179,155,199,0.26)]">
          <div className="grid grid-cols-[44%_1fr] items-stretch gap-4 rounded-[10px]">
            <div className="mx-auto aspect-[3/4] w-[90%] overflow-hidden bg-white">
              <img
                src={bearPhoto}
                alt="くまのぬいぐるみ"
                className="h-full w-full object-cover object-center"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="flex flex-col justify-start pr-2 pt-1">
              <h4 className="mb-3 text-[1.52rem] font-semibold leading-none tracking-[0.12em]">くまさん</h4>
              <p className="text-sm leading-relaxed tracking-[0.03em] md:text-base">
                友実が小学生の時に
                <br />
                初めて作ったぬいぐるみ
              </p>
            </div>
          </div>
        </section>
      ) : null}
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
          <div className="inline-flex items-center gap-3 font-['Playfair_Display'] text-[2rem] font-semibold leading-none tracking-[0.01em] text-[color:var(--ink)] md:text-[2.2rem]">
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
                {index === 0 ? <span className="text-[1.6rem] opacity-70">/</span> : null}
              </div>
            ))}
          </div>
        </div>

        <ProfileBlock
          key={currentProfile.id}
          profile={currentProfile.profile}
          label={currentProfile.label}
          image={currentProfile.image}
          isBride={currentProfile.id === "bride"}
        />
      </div>
    </SectionShell>
  );
}

export default ProfilePage;
