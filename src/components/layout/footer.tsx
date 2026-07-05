import Link from "next/link";
import { profile } from "@/data/profile";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { PromptingIsAllYouNeed } from "@/components/ui/animated-hero-section";

export function Footer() {
  return (
    <footer className="relative bg-[#101612] overflow-hidden border-t border-[var(--world-b-border)] flex flex-col">
      <div className="w-full z-10">
        <InfiniteRibbon
          text="THANK YOU FOR SCROLLING"
          bgClass="bg-[var(--world-b-accent)] text-[#101612]"
          textClass="text-[#101612]"
          speed="30s"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-[var(--world-b-text)]">
        <div className="text-center md:text-left">
          <p className="font-serif text-3xl font-bold">{profile.name}</p>
          <p className="mt-2 text-sm text-[var(--world-b-muted)] uppercase tracking-widest">{profile.location}</p>
        </div>

        <ul className="flex items-center gap-8">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <Link
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[var(--world-b-muted)] transition-colors hover:text-[var(--world-b-text)]"
              >
                {social.label}
                <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[var(--world-b-accent)]">
                  &nearr;
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs font-mono text-[var(--world-b-muted)]">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>

      {/* Pong Game spelling ILYASRHMN - Placed at the very bottom */}
      <div className="w-full border-t border-[var(--world-b-border)] pb-8">
        <PromptingIsAllYouNeed />
      </div>
    </footer>
  );
}
