export type ProjectStatus = "shipped" | "building";

export type Project = {
  slug: string;
  title: string;
  category: string;
  year: string;
  status: ProjectStatus;
  summary: string;
  description: string;
  image: string;
  stack: string[];
  demo?: string;
  repo?: string;
  featured?: boolean;
};

export type JourneyKind = "education" | "teaching" | "building" | "learning";

export type JourneyItem = {
  year: string;
  kind: JourneyKind;
  title: string;
  org?: string;
  detail: string;
};

export type Certificate = {
  slug: string;
  program: string;
  issuer: string;
  skills: string[];
  credentialUrl?: string;
  credentialId?: string;
  track?: string;
  image: string;
  issuedDate: string;
  expiryDate?: string;
};

export type StackGroup = {
  label: string;
  items: string[];
};

export type Profile = {
  name: string;
  role: string;
  location: string;
  positioning: string;
  email: string;
  socials: { label: string; url: string }[];
};
