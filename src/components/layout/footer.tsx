import Link from "next/link";
import { profile } from "@/data/profile";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { FooterSignature } from "@/components/layout/footer-signature";

export function Footer() {
  return (
    <footer className="relative bg-[#101612] overflow-hidden border-t border-[#29342C] flex flex-col">
      <div className="w-full z-10">
        <InfiniteRibbon
          text="THANK YOU FOR SCROLLING"
          bgClass="bg-[var(--world-b-accent)] text-[#101612]"
          textClass="text-[#101612]"
          speed="30s"
        />
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 py-16 flex flex-col md:flex-row items-center justify-between gap-8 text-[#E8E5DA]">
        <div className="text-center md:text-left">
          <p className="font-serif text-3xl font-bold">{profile.name}</p>
          <p className="mt-2 text-sm text-[#98A39A] uppercase tracking-widest">{profile.location}</p>
        </div>

        <ul className="flex items-center gap-8">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <Link
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-[#98A39A] transition-colors hover:text-[#E8E5DA]"
              >
                {social.label}
                <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0 text-[#8FAF8F]">
                  &nearr;
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs font-mono text-[#98A39A]">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>

      <div className="w-full border-t border-[#29342C] pb-8">
        <FooterSignature />
      </div>
    </footer>
  );
}
