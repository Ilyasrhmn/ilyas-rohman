import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { certificates } from "@/data/certificates";
import { ExternalLink, ArrowLeft, Award, Calendar, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: "Achievements — Certifications & Awards",
  description:
    "A collection of professional certifications in AI, Web Development, Data Science, and Blockchain.",
};

export default function AchievementsPage() {
  const tracks = Array.from(new Set(certificates.map((c) => c.track ?? "Other")));

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="section-pad px-6 sm:px-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[10%] right-[15%] w-[500px] h-[500px] bg-primary/15 blur-[100px] rounded-full" />
          <div className="absolute bottom-[10%] left-[10%] w-[400px] h-[400px] bg-accent/10 blur-[80px] rounded-full" />
        </div>

        <div className="mx-auto max-w-6xl relative z-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <div className="space-y-6 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/50 backdrop-blur-md border border-border/50">
              <Award className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-mono font-bold tracking-[0.3em] uppercase">
                Certifications & Achievements
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter leading-[0.95]">
              Validating{" "}
              <span className="italic text-primary">Excellence</span>
              <br />
              through Global Standards.
            </h1>

            <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
              A collection of my professional certifications in AI, Web
              Development, and Cloud Engineering from industry leaders.
            </p>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Certificates", value: certificates.length.toString() },
              { label: "Tracks", value: tracks.length.toString() },
              { label: "Primary Issuer", value: "Dicoding" },
              { label: "Status", value: "Active" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="glass-card rounded-xl p-4 text-center"
              >
                <p className="text-2xl font-black text-foreground">
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Certificates by Track */}
      {tracks.map((track) => {
        const trackCerts = certificates.filter(
          (c) => (c.track ?? "Other") === track
        );
        return (
          <section key={track} className="px-6 sm:px-10 pb-20">
            <div className="mx-auto max-w-6xl">
              <div className="flex items-center gap-3 mb-8">
                <Shield className="w-5 h-5 text-primary" />
                <h2 className="text-sm font-mono tracking-[0.2em] uppercase text-muted-foreground">
                  {track}
                </h2>
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">
                  {trackCerts.length} cert{trackCerts.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {trackCerts.map((cert) => (
                  <a
                    key={cert.slug}
                    href={cert.credentialUrl || undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group glass-card rounded-xl overflow-hidden transition-all hover:scale-[1.02] hover:-translate-y-1 block"
                  >
                    {/* Image */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-card">
                      <Image
                        src={cert.image}
                        alt={cert.program}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                      {/* Track badge */}
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm border border-white/10 text-[0.65rem] text-white/90 font-mono uppercase tracking-wider">
                        {cert.track}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-5 space-y-3">
                      <div>
                        <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors leading-tight">
                          {cert.program}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {cert.issuer}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Issued {cert.issuedDate}</span>
                        {cert.expiryDate && (
                          <span>· Expires {cert.expiryDate}</span>
                        )}
                      </div>

                      {cert.credentialId && (
                        <p className="text-xs text-muted-foreground font-mono">
                          Credential ID {cert.credentialId}
                        </p>
                      )}

                      {/* Skills */}
                      <ul className="flex flex-wrap gap-1.5">
                        {cert.skills.slice(0, 3).map((s) => (
                          <li
                            key={s}
                            className="rounded-full border border-border px-2.5 py-0.5 text-[0.65rem] text-foreground/80"
                          >
                            {s}
                          </li>
                        ))}
                        {cert.skills.length > 3 && (
                          <li className="rounded-full border border-border px-2.5 py-0.5 text-[0.65rem] text-muted-foreground">
                            +{cert.skills.length - 3}
                          </li>
                        )}
                      </ul>

                      {/* Show Credential */}
                      {cert.credentialUrl && (
                        <div className="pt-2 border-t border-border">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary group-hover:underline">
                            Show credential
                            <ExternalLink className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      )}
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
