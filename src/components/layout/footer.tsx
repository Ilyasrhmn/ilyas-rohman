import Link from "next/link";
import { profile } from "@/data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-center sm:text-left">
          <p className="font-serif text-lg text-foreground">{profile.name}</p>
          <p className="text-sm text-muted-foreground">{profile.location}</p>
        </div>

        <ul className="flex items-center gap-6">
          {profile.socials.map((social) => (
            <li key={social.label}>
              <Link
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {social.label}
              </Link>
            </li>
          ))}
        </ul>

        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {profile.name}
        </p>
      </div>
    </footer>
  );
}
