import puppiesJson from '@/data/puppies.json';
import goneJson from '@/data/gone-home.json';
import familiesJson from '@/data/families.json';
import showroomJson from '@/data/showroom.json';
import faqsJson from '@/data/faqs.json';

export type Media = {
  url: string;
  kind: string;
  width: number;
  height: number;
  alt: string;
  caption?: string;
  focalX: number;
  focalY: number;
  color: string;
  blurDataUrl?: string;
  poster?: Media;
};

export type Puppy = {
  id: string;
  slug: string;
  name: string;
  displayName: string;
  breed: string;
  gender: string;
  genderLabel: string;
  age: string;
  colour?: string;
  description?: string;
  status: string;
  breeds: { slug: string; name: string }[];
  origin: { slug: string; name: string } | null;
  collections: { slug: string; name: string }[];
  cover: Media;
  media: Media[];
};

export type Faq = { q: string; a: string; tilt: string; pin: string };

export const puppies = puppiesJson as Puppy[];
export const available = puppies.filter((p) => p.status === 'available');
export const goneHome = (goneJson as string[]).map((s) => puppies.find((p) => p.slug === s)!).filter(Boolean);
export const families = familiesJson as Media[];
export const showroom = showroomJson as Media[];
export const faqs = faqsJson as Faq[];

export const puppyBySlug = (slug: string) => puppies.find((p) => p.slug === slug);

// Cards carry only what they render, so client bundles do not ship every gallery.
export const toCard = (p: Puppy) => ({
  slug: p.slug,
  name: p.name,
  displayName: p.displayName,
  breed: p.breed,
  gender: p.gender,
  genderLabel: p.genderLabel,
  age: p.age,
  status: p.status,
  breeds: p.breeds,
  origin: p.origin,
  collections: p.collections,
  cover: p.cover,
  hasVideo: p.media.some((m) => m.kind === 'video'),
});

export type PuppyCardData = ReturnType<typeof toCard>;
