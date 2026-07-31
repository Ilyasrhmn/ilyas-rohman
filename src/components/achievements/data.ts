import type { Certificate } from "@/types";

export type CertificateGroup = {
  track: string;
  note: string;
  certs: Certificate[];
};

// Editorial notes per spec (docs/superpowers/specs/2026-07-31-achievements-redesign-design.md).
// Fixed copy, not derived — only the counts and ordering come from certificates.ts.
const TRACK_NOTES: Record<string, string> = {
  Frontend: "The bulk of it. This is the part I do for a living.",
  "AI & Machine Learning": "Where the maths stopped being optional.",
  Design: "Enough UX to argue with a designer and lose politely.",
  "Data Science": "One course, one honest beginner.",
  Blockchain: "A literacy month. I came out curious, not converted.",
  "Problem Solving": "Algorithms, timed, no autocomplete.",
};

/** Groups certificates by track, groups ordered by cert count descending (ties keep first-seen order). */
export function groupByTrack(certificates: Certificate[]): CertificateGroup[] {
  const order: string[] = [];
  const byTrack = new Map<string, Certificate[]>();

  for (const cert of certificates) {
    const track = cert.track ?? "Other";
    if (!byTrack.has(track)) {
      byTrack.set(track, []);
      order.push(track);
    }
    byTrack.get(track)!.push(cert);
  }

  return order
    .map((track) => ({
      track,
      note: TRACK_NOTES[track] ?? "",
      certs: byTrack.get(track)!,
    }))
    .sort((a, b) => b.certs.length - a.certs.length);
}

/** "Jun 2026" -> "2026", "2026" -> "2026". */
export function issuedYear(issuedDate: string): string {
  return issuedDate.match(/\d{4}/)?.[0] ?? issuedDate;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// ponytail: bare "YYYY" dates (no month) rank as January of that year, so they never
// beat a same-year "Mon YYYY" entry for "last added" — good enough without a real date type.
function issuedRank(issuedDate: string): number {
  const parts = issuedDate.split(" ");
  const year = Number(parts[parts.length - 1]);
  const monthIdx = parts.length > 1 ? MONTHS.indexOf(parts[0]) : 0;
  return year * 12 + Math.max(monthIdx, 0);
}

/** Most recent issuedDate string in the data, e.g. "Jun 2026". */
export function lastAddedLabel(certificates: Certificate[]): string {
  return certificates.reduce((a, b) => (issuedRank(b.issuedDate) > issuedRank(a.issuedDate) ? b : a))
    .issuedDate;
}
