import Link from "next/link";
import { profile } from "@/data/profile";
import { PongGame } from "@/components/ui/pong-game";

export function Footer() {
  return (
    <footer className="relative bg-[#101612] overflow-hidden border-t border-[var(--world-b-border)] flex flex-col">
      <div className="w-full z-10 bg-[var(--world-b-accent)] py-3">
        <p className="text-center font-mono text-xs uppercase tracking-widest text-[#101612]">
          Available for work · {profile.email} · {profile.location}
        </p>
      </div>

      <div className="flex h-screen min-h-screen flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="font-serif text-lg font-bold text-[#E8E5DA]">{profile.name}</span>
            <span className="text-[#98A39A]" aria-hidden="true">
              ·
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[#98A39A]">{profile.location}</span>
            <span className="text-[#98A39A]" aria-hidden="true">
              ·
            </span>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex min-h-[44px] items-center font-mono text-sm text-[#98A39A] transition-colors hover:text-[#8FAF8F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {profile.email}
            </a>
          </div>

          <ul className="flex items-center gap-6">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex min-h-[44px] items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#98A39A] transition-colors hover:text-[#E8E5DA] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {social.label}
                  <span className="text-[#8FAF8F] opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                    ↗
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-h-0 w-full flex-1">
          <PongGame />
        </div>

        <div className="mx-auto w-full max-w-7xl px-6 py-3">
          <p className="text-xs font-mono text-[#98A39A]">
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
