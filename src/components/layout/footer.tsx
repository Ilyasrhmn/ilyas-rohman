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

      <div className="mx-auto w-full max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <p className="font-serif text-3xl font-bold text-[#E8E5DA]">{profile.name}</p>
            <p className="mt-2 text-sm uppercase tracking-widest text-[#98A39A]">{profile.location}</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-2 inline-flex min-h-[44px] items-center font-mono text-sm text-[#98A39A] transition-colors hover:text-[#8FAF8F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {profile.email}
            </a>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-[#8FAF8F]">Elsewhere</p>
            <ul className="mt-4 flex flex-col gap-1">
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
                      &nearr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[#29342C] pt-6">
          <p className="text-xs font-mono text-[#98A39A]">
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>

      {/* Pong Game spelling ILYASRHMN - Placed at the very bottom */}
      <div className="w-full border-t border-[var(--world-b-border)] pb-8">
        <PongGame />
      </div>
    </footer>
  );
}
