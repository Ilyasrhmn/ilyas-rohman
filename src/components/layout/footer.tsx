import Link from "next/link";
import { profile } from "@/data/profile";
import { InfiniteRibbon } from "@/components/ui/infinite-ribbon";

export function Footer() {
  return (
    <footer className="relative bg-background overflow-hidden">
      <div className="absolute top-0 w-full">
        <InfiniteRibbon
          text="THANK YOU FOR SCROLLING"
          bgClass="bg-foreground text-background"
          textClass="text-background"
          speed="30s"
        />
      </div>
      
      <div className="mx-auto max-w-6xl px-6 pt-32 pb-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-left">
          <p className="font-serif text-3xl text-foreground">{profile.name}</p>
          <p className="mt-2 text-sm text-muted-foreground uppercase tracking-widest">{profile.location}</p>
        </div>

        <ul className="flex items-center gap-8">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <Link
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-muted-foreground transition-colors hover:text-foreground"
              >
                {social.label}
                <span className="opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                  &nearr;
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs font-mono text-muted-foreground">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
