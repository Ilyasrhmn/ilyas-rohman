import Link from "next/link";
import { profile } from "@/data/profile";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";
import { FooterSignature } from "@/components/layout/footer-signature";

const PAGES = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/projects" },
  { label: "Achievements", href: "/achievements" },
];

const LINK_FOCUS =
  "focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-[#8FAF8F]";

export function Footer() {
  const contactLine = `AVAILABLE FOR WORK ✧ ${profile.email.toUpperCase()} ✧ ${profile.location.toUpperCase()}`;

  return (
    <footer className="relative bg-[#101612] overflow-hidden border-t border-[#29342C] flex flex-col">
      <a
        href={`mailto:${profile.email}`}
        aria-label={`Email ${profile.name} at ${profile.email}`}
        className={`block w-full z-10 transition-opacity duration-200 motion-reduce:transition-none hover:opacity-80 ${LINK_FOCUS}`}
      >
        <div aria-hidden="true">
          <InfiniteRibbon
            text={contactLine}
            bgClass="bg-[var(--world-b-accent)] text-[#101612]"
            textClass="text-[#101612]"
            speed="30s"
          />
        </div>
      </a>

      <div className="mx-auto w-full max-w-7xl px-6 py-16 text-[#E8E5DA]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">
          <div className="md:col-span-2">
            <p className="font-serif text-3xl font-bold">{profile.name}</p>
            <p className="mt-2 font-mono text-sm uppercase tracking-widest text-[#98A39A]">
              {profile.location}
            </p>
            <a
              href={`mailto:${profile.email}`}
              className={`mt-4 inline-flex min-h-[44px] items-center font-mono text-sm text-[#98A39A] transition-colors hover:text-[#E8E5DA] ${LINK_FOCUS}`}
            >
              {profile.email}
            </a>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#98A39A]">Pages</p>
            <ul className="mt-4 space-y-1">
              {PAGES.map((page) => (
                <li key={page.href}>
                  <Link
                    href={page.href}
                    className={`inline-flex min-h-[44px] items-center font-mono text-sm text-[#E8E5DA] transition-colors hover:text-[#8FAF8F] ${LINK_FOCUS}`}
                  >
                    {page.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#98A39A]">Elsewhere</p>
            <ul className="mt-4 space-y-1">
              {profile.socials.map((social) => (
                <li key={social.label}>
                  <Link
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`group inline-flex min-h-[44px] items-center gap-2 font-mono text-sm uppercase tracking-widest text-[#98A39A] transition-colors hover:text-[#E8E5DA] ${LINK_FOCUS}`}
                  >
                    {social.label}
                    <span className="-translate-x-2 text-[#8FAF8F] opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100">
                      &nearr;
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-[#29342C] pt-6">
          <p className="text-xs font-mono text-[#98A39A]">
            &copy; {new Date().getFullYear()} {profile.name}
          </p>
        </div>
      </div>

      <div className="w-full border-t border-[#29342C] pb-8">
        <FooterSignature />
      </div>
    </footer>
  );
}
