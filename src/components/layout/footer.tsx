import Link from "next/link";
import { profile } from "@/data/profile";
import { PongGame } from "@/components/ui/pong-game";

export function Footer() {
  return (
    <footer className="relative bg-[#101612] overflow-hidden border-t border-[#29342C] flex flex-col">
      <div className="flex flex-col">
        {/* Name on the left, socials on the right; the game has its own row below. */}
        <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-6 sm:px-10 md:flex-nowrap">
          <span className="font-serif text-lg font-bold text-[#E8E5DA]">{profile.name}</span>

          <ul className="flex items-center gap-6">
            {profile.socials.map((social) => (
              <li key={social.label}>
                <Link
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[44px] items-center text-sm font-medium uppercase tracking-widest text-[#98A39A] underline decoration-transparent underline-offset-4 transition-colors hover:text-[#E8E5DA] hover:decoration-[#8FAF8F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {social.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full border-t border-[#29342C]">
          <PongGame />
        </div>
      </div>
    </footer>
  );
}
