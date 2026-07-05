# Ilyas Nur Rohman — Portfolio

Cinematic-lite, interaction-rich portfolio built with Next.js 16, TypeScript, Tailwind CSS 4, Framer Motion, GSAP, and Lenis. Fuses three reference designs — see `docs/superpowers/specs/2026-07-05-portfolio-fusion-design.md` in the repo root for the design rationale.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All copy lives in typed data files under `src/data/` — no code changes needed to update content:

- `src/data/profile.ts` — name, role, positioning statement, socials
- `src/data/projects.ts` — projects (hackathon/campus/in-progress); `status: "building"` shows the "Currently Building" treatment instead of demo links
- `src/data/journey.ts` — growth timeline items (`kind: "education" | "teaching" | "building" | "learning"`)
- `src/data/certificates.ts` — Learning & Achievements entries (`program`, `issuer`, `skills`, `credentialUrl`)
- `src/data/stack.ts` — capability groups shown in the Stack section

## Contact form

`POST /api/contact` validates and (optionally) emails submissions via `nodemailer`. Without SMTP env vars set, it accepts and logs to the server console — useful for local dev. To send real email in production, set:

```
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
CONTACT_TO=        # defaults to SMTP_USER if unset
NEXT_PUBLIC_SITE_URL=   # your deployed URL, used for OG image resolution
```

## Structure

- `/` — single long-scroll home: Hero → Works → About → Journey → Stack → Certificates → CTA
- `/projects`, `/projects/[slug]` — project grid and case-study detail pages
- Contact is a modal (triggered from the navbar or the CTA section), not a route

## Testing

```bash
npx tsx --test src/data/data.test.ts src/app/api/contact/route.test.ts
```
